/**
 * Created by baizz on 2015-04-09.
 *
 * ES查询接口
 * quotas: 指标
 * dimension: 维度
 * filters: 过滤器
 */

require('../utils/dateFormat')();

var buildMustQuery = function (filters) {
    var mustQuery = [];

    if (filters != null) {
        filters.forEach(function (filter) {
            mustQuery.push({
                "terms": filter
            });
        });
    }

    return mustQuery;
};

var buildQuery = function (filters) {
    return {
        "bool": {
            "must": buildMustQuery(filters)
        }
    }
};

var es_aggs = {
    // 浏览量
    "pv": {
        "pv_aggs": {
            "sum": {
                "script": "_source.loc.size()"
            }
        }
    },
    // 贡献浏览量
    "contribution": {
        "cpv_aggs": {
            "value_count": {
                "field": "entrance"
            }
        }
    },
    // 访客数
    "uv": {
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // 访问次数
    "vc": {
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // 跳出率
    "outRate": {
        "single_visitor_aggs": {
            "filter": {
                "script": {
                    "script": "_source.loc.size() == param1",
                    "params": {
                        "param1": 1
                    }
                }
            },
            "aggs": {
                "svc_aggs": {
                    "value_count": {
                        "field": "tt"
                    }
                }
            }
        },
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // 平均访问时长
    "avgTime": {
        "tvt_aggs": {
            "sum": {
                "script": "sum_time = 0; len = _source.utime.size() - 1; if (len > 0) { sum_time = doc['utime'].get(len) - doc['utime'].get(0) }; sum_time"
            }
        },
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // 新访客数
    "nuv": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        }
    },
    // 新访客比率
    "nuvRate": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        },
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // 平均访问页数
    "avgPage": {
        "pv_aggs": {
            "sum": {
                "script": "_source.loc.size()"
            }
        },
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // IP数
    "ip": {
        "ip_aggs": {
            "cardinality": {
                "field": "remote"
            }
        }
    },
    // 抵达率=访问次数/点击量
    "arrivedRate": {
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // TODO 页面转化
    "pageConversion": {},
    // TODO 事件转化
    "eventConversion": {}
};

var buildRequest = function (indexes, type, quotas, dimension, filters, start, end, interval) {

    var _aggs = {};

    quotas.forEach(function (quota) {
        for (var key in es_aggs[quota]) {
            _aggs[key] = es_aggs[quota][key];
        }
    });

    if (dimension == null) {
        if (interval == 0)  // 此时统计三十分钟以内的数据
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "filter": {
                                "range": {
                                    "utime": {"gte": start, "lte": end}
                                }
                            },
                            "aggs": {
                                "result": {
                                    "date_histogram": {
                                        "field": "utime",
                                        "interval": "1m",
                                        "pre_zone": "+08:00",
                                        "post_zone": "+08:00",
                                        "order": {
                                            "_key": "asc"
                                        },
                                        "min_doc_count": 0,
                                        "extended_bounds": {
                                            "min": start,
                                            "max": end
                                        }
                                    }, "aggs": _aggs
                                }
                            }
                        }
                    }
                }
            };
        else
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "filter": {
                                "script": {
                                    "script": "_source.loc.size() > param1",
                                    "params": {
                                        "param1": 0
                                    }
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
    }

    if (dimension.split(",").length > 1) {  // 多维度统计
        var dimensionArr = dimension.split(",");
        return {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
                            "format": "yyyy-MM-dd HH:mm:ss",
                            //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                            "pre_zone": "+08:00",
                            "post_zone": "+08:00",
                            "order": {
                                "_key": "asc"
                            },
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        },
                        "aggs": {
                            "dimension": {
                                "terms": {
                                    "field": dimensionArr[1]
                                },
                                "aggs": _aggs
                            }
                        }
                    }
                }
            }
        };
    }

    if (dimension == "period") {
        if (interval == 1)  // 按小时统计数据
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "date_histogram": {
                                "field": "utime",
                                "interval": interval + "h",
                                "format": "HH",
                                //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                                "pre_zone": "+08:00",
                                "post_zone": "+08:00",
                                "order": {
                                    "_key": "asc"
                                },
                                "min_doc_count": 0,
                                "extended_bounds": {
                                    "min": start,
                                    "max": end
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
        else {
            var inter = interval / 1000 + "s";
            if (interval == 604800000) {
                inter = "1w";
            } else if (interval == 2592000000) {
                inter = "1M";
            }
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "date_histogram": {
                                "field": "utime",
                                "interval": inter,
                                "format": "yyyy-MM-dd HH:mm:ss",
                                //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                                "pre_zone": "+08:00",
                                "post_zone": "+08:00",
                                "order": {
                                    "_key": "asc"
                                },
                                "min_doc_count": 0,
                                "extended_bounds": {
                                    "min": start,
                                    "max": end
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
        }
    } else {
        var dimensionScript = "";
        if (dimension.split(":").length > 1) {
            var _arr = dimension.split(":");

            for (var i = 0, l = _arr.length; i < l; i++) {
                if (i === l - 1)
                    dimensionScript += ("doc[\'" + _arr[i] + "\'].value");
                else
                    dimensionScript += ("doc[\'" + _arr[i] + "\'].value+\'," + "\'+");
            }
        } else
            dimensionScript = ("doc[\'" + dimension + "\'].value");

        return {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "terms": {
                            "script": dimensionScript
                            //"field": dimension,
                            //"order": {
                            //    "_key": "asc"
                            //}
                        },
                        "aggs": _aggs
                    }
                }
            }
        };
    }

};

var pvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            Array.prototype.push.call(keyArr, dateStr);
        } else
            Array.prototype.push.call(keyArr, result[i].key);

        Array.prototype.push.call(quotaArr, pv);
    }

    return {
        "label": "pv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var contributionFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var cpv = result[i].cpv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            Array.prototype.push.call(keyArr, dateStr);
        } else
            Array.prototype.push.call(keyArr, result[i].key);

        Array.prototype.push.call(quotaArr, cpv);
    }

    return {
        "label": "contribution",
        "key": keyArr,
        "quota": quotaArr
    };
};

var uvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var uv = result[i].uv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(uv);
    }

    return {
        "label": "uv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var vcFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(vc);
    }

    return {
        "label": "vc",
        "key": keyArr,
        "quota": quotaArr
    };
};

var avgTimeFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var tvt = result[i].tvt_aggs.value;
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var avgTime = 0;
        if (vc > 0)
            avgTime = Math.ceil(parseFloat(tvt) / 1000 / parseFloat((vc)));

        quotaArr.push(avgTime);
    }

    return {
        "label": "avgTime",
        "key": keyArr,
        "quota": quotaArr
    };
};

var outRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var svc = result[i].single_visitor_aggs.svc_aggs.value;
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var outRate = 0;
        if (vc > 0)
            outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2);

        quotaArr.push(outRate);
    }

    return {
        "label": "outRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var nuvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(nuv);
    }

    return {
        "label": "nuv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var nuvRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.value;
        var uv = result[i].uv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var nuvRate = 0;
        if (uv > 0)
            nuvRate = (parseFloat(nuv) / parseFloat(uv) * 100).toFixed(2);

        quotaArr.push(nuvRate);
    }

    return {
        "label": "nuvRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var ipFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var ip_count = result[i].ip_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(ip_count);
    }

    return {
        "label": "ip",
        "key": keyArr,
        "quota": quotaArr
    };
};

var avgPageFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        var uv = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var avgPage = 0;
        if (uv > 0)
            avgPage = (parseFloat(pv) / parseFloat(uv)).toFixed(2);

        quotaArr.push(avgPage);
    }

    return {
        "label": "avgPage",
        "key": keyArr,
        "quota": quotaArr
    };
};

var arrivedRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(vc);
    }

    return {
        "label": "arrivedRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var pageConversionFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "pageConversion",
        "key": keyArr,
        "quota": quotaArr
    };
};

var eventConversionFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "eventConversion",
        "key": keyArr,
        "quota": quotaArr
    };
};

var es_request = {
    search: function (es, indexes, type, quotas, dimension, topN, filters, start, end, interval, callbackFn) {
        var request = null;
        var _aggs = null;

        switch (topN[0]) {
            case "-1":  // circle topN, 适用于单一指标
                var mustQuery = buildMustQuery(filters);
                mustQuery.push({
                    "range": {
                        "utime": {
                            "from": start, "to": end
                        }
                    }
                });

                for (var key in es_aggs[quotas[0]]) {
                    _aggs = {
                        "top_hit": es_aggs[quotas[0]][key]
                    };
                }

                request = {
                    "index": indexes,
                    "type": type,
                    "body": {
                        "query": {
                            "bool": {
                                "must": mustQuery
                            }
                        },
                        "size": 0,
                        "aggs": {
                            "result": {
                                "terms": {
                                    "field": dimension,
                                    "order": {
                                        "top_hit": "desc"
                                    },
                                    "size": topN[1]
                                },
                                "aggs": _aggs
                            }
                        }
                    }
                };
                break;
            case "-2":  // period topN, 适用于单一指标, 结果由调用者处理
                for (var _key in es_aggs[quotas[0]]) {
                    _aggs = {
                        "top_hit": es_aggs[quotas[0]][_key]
                    };
                }

                request = {
                    "index": indexes,
                    "type": type,
                    "body": {
                        "query": buildQuery(filters),
                        "size": 0,
                        "aggs": {
                            "result": {
                                "date_histogram": {
                                    "field": "utime",
                                    "interval": interval / 1000 + "s",
                                    "format": "yyyy-MM-dd HH:mm:ss",
                                    "pre_zone": "+08:00",
                                    "post_zone": "+08:00",
                                    "order": {
                                        "_key": "asc"
                                    },
                                    "min_doc_count": 0,
                                    "extended_bounds": {
                                        "min": start,
                                        "max": end
                                    }
                                },
                                "aggs": {
                                    "dimension": {
                                        "terms": {
                                            "field": dimension.split(",")[1],
                                            "order": {
                                                "top_hit": "desc"
                                            },
                                            "size": topN[1]
                                        },
                                        "aggs": _aggs
                                    }
                                }
                            }
                        }
                    }
                };
                break;
            default :
                request = buildRequest(indexes, type, quotas, dimension, filters, start, end, interval);
                break;
        }

        es.search(request, function (error, response) {
            var data = [];
            if (response != undefined && response.aggregations != undefined && response.aggregations.result != undefined) {
                var result = response.aggregations.result.buckets;

                if (!result) {
                    result = [];
                    result.push(response.aggregations.result);
                }

                if (dimension == null && interval == 0) {
                    callbackFn(result);
                } else {
                    if (dimension != null && dimension.split(",").length > 1) {
                        callbackFn(result);
                    } else {
                        quotas.forEach(function (quota) {
                            switch (quota) {
                                case "pv":
                                    data.push(pvFn(result, dimension));
                                    break;
                                case "contribution":
                                    data.push(contributionFn(result, dimension));
                                    break;
                                case "uv":
                                    data.push(uvFn(result, dimension));
                                    break;
                                case "vc":
                                    data.push(vcFn(result, dimension));
                                    break;
                                case "avgTime":
                                    data.push(avgTimeFn(result, dimension));
                                    break;
                                case "outRate":
                                    data.push(outRateFn(result, dimension));
                                    break;
                                case "arrivedRate":
                                    data.push(arrivedRateFn(result, dimension));
                                    break;
                                case "avgPage":
                                    data.push(avgPageFn(result, dimension));
                                    break;
                                case "pageConversion":
                                    data.push(pageConversionFn(result, dimension));
                                    break;
                                case "eventConversion":
                                    data.push(eventConversionFn(result, dimension));
                                    break;
                                case "ip":
                                    data.push(ipFn(result, dimension));
                                    break;
                                case "nuv":
                                    data.push(nuvFn(result, dimension));
                                    break;
                                case "nuvRate":
                                    data.push(nuvRateFn(result, dimension));
                                    break;
                                default :
                                    break;
                            }
                        });
                        callbackFn(data);
                    }
                }
            } else
                callbackFn(data);
        });
    },
    // 获取近30分钟的访问数据
    realTimeSearch: function (es, index, type, filters, callbackFn) {
        var endTime = new Date().getTime();
        var startTime = endTime - 1800000;

        var mustQuery = [{
            "range": {
                "utime": {
                    "from": startTime, "to": endTime
                }
            }
        }];

        if (filters != null) {
            filters.forEach(function (filter) {
                mustQuery.push({
                    "terms": filter
                });
            });
        }

        var request = {
            "index": index,
            "type": type,
            "body": {
                "query": {
                    "bool": {
                        "must": mustQuery
                    }
                },
                "sort": {"utime": {"order": "asc"}},
                "size": 100000
            }
        };

        es.search(request, function (error, response) {
            if (response != undefined && response.hits != undefined) {
                var hits = response.hits.hits;
                hits.forEach(function (item) {
                    var locArr = item._source.loc;
                    var utimeArr = item._source.utime;
                    var record = [];

                    for (var i = 0, l = utimeArr.length - 1; i <= l; i++) {
                        var obj = {};
                        if (i == l) {
                            obj["loc"] = locArr[i];
                            obj["vtime"] = "-";
                            record.push(obj);
                        } else {
                            obj["loc"] = locArr[i];
                            obj["vtime"] = new Date(utimeArr[i + 1] - utimeArr[i]).format("hh:mm:ss");
                            record.push(obj);
                        }
                    }

                    item["record"] = record;
                });

                if (hits.length === 1) {
                    // 计算上一次的访问时间
                    es.search({
                        "index": index,
                        "type": type,
                        "body": {
                            "query": {
                                "bool": {
                                    "must": buildMustQuery([
                                        {"vid": [hits[0]._source.vid]}
                                    ])
                                }
                            },
                            "size": 0,
                            "aggs": {
                                "result": {
                                    "terms": {
                                        "script": "doc['utime'].value",
                                        "order": {
                                            "_term": "desc"
                                        }
                                    }
                                }
                            }
                        }
                    }, function (error, response) {
                        if (response != undefined && response.aggregations != undefined) {
                            var resultArr = response.aggregations.result.buckets;
                            if (resultArr.length == 1)
                                hits[0]["last"] = "首次访问";
                            else {
                                var curr = hits[0]._source.utime[0];
                                for (var i = 0, l = resultArr.length; i < l; i++) {
                                    if (curr == resultArr[i].key) {
                                        if (i + 1 == l)
                                            hits[0]["last"] = "首次访问";
                                        else
                                            hits[0]["last"] = resultArr[i + 1].key;

                                        break;
                                    }
                                }
                            }
                        }

                        callbackFn(hits);
                    });
                } else {
                    callbackFn(hits);
                }
            } else
                callbackFn([]);
        });
    },
    top5visit: function (es, indexes, type, ct, callbackFn) {   // index => access-*
        var request = {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": {
                    "bool": {
                        "must": {
                            "term": {
                                "ct": ct
                            }
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "direct_result": {
                        "filter": {
                            "script": {
                                "script": "doc['rf_type'].value == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        },
                        "aggs": {
                            "direct_aggs": {
                                "value_count": {
                                    "field": "rf"
                                }
                            }
                        }
                    },
                    "se_result": {
                        "filter": {
                            "script": {
                                "script": "doc['rf_type'].value == 2"
                            }
                        },
                        "aggs": {
                            "se_aggs": {
                                "terms": {
                                    "field": "se"
                                }
                            }
                        }
                    },
                    "other_result": {
                        "filter": {
                            "script": {
                                "script": "doc['rf_type'].value == 3"
                            }
                        },
                        "aggs": {
                            "chain_aggs": {
                                "terms": {
                                    "field": "dm"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            if (response != undefined && response.aggregations != undefined) {
                var aggs_results = response.aggregations;
                var results = [];
                var directObj = {};
                directObj["key"] = "直接访问";
                directObj["count"] = aggs_results.direct_result.direct_aggs.value;

                results.push(directObj);
                aggs_results.se_result.se_aggs.buckets.forEach(function (item, index) {
                    var obj = {};
                    obj["key"] = item.key;
                    obj["count"] = item.doc_count;
                    results.push(obj);
                });

                aggs_results.other_result.chain_aggs.buckets.forEach(function (item, index) {
                    var obj = {};
                    obj["key"] = item.key;
                    obj["count"] = item.doc_count;
                    results.push(obj);
                });

                results.sort(function (o1, o2) {
                    return o2["count"] - o1["count"]
                });

                if (results.length > 5)
                    callbackFn(results.slice(0, 5));
                else
                    callbackFn(results);

            }
        });
    }
};

module.exports = es_request;