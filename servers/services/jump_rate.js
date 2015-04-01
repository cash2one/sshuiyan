/**
 * Created by baizz on 2015-4-1.
 *
 * key: millisecond
 * rate: 跳出率
 *
 * 返回的数据格式: [{"key":1427853600000,"rate":"100.00%"},{"key":1427857200000,"rate":"33.33%"}]
 */

var jump_rate = {
    cal: function (es, start, end, intervals, index, type, callbackFn) {
        var single_uv_request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "filtered": {
                        "query": {
                            "range": {
                                "utime": {
                                    "gte": start,
                                    "lte": end
                                }
                            }
                        },
                        "filter": {
                            "script": {
                                "script": "doc[\"loc\"].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": intervals / 1000 + "s",
                            "time_zone": "+08:00",
                            "order": {
                                "_key": "asc"
                            },
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        }
                    }
                }
            }
        };

        var total_uv_request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "range": {
                        "utime": {
                            "gte": start,
                            "lte": end
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": intervals / 1000 + "s",
                            "time_zone": "+08:00",
                            "order": {"_key": "asc"},
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        },
                        "aggs": {
                            "tuv": {
                                "value_count": {
                                    "field": "tt"
                                }
                            }
                        }
                    }
                }
            }
        };

        var single_uv_result = null;

        function getSingleUVResult() {
            return single_uv_result;
        }

        es.search(single_uv_request, function (error, response) {
            if (response != undefined)
                single_uv_result = response.aggregations.result.buckets;
            else
                console.error(error);
        });

        es.search(total_uv_request, function (error, response) {
            if (response != undefined) {
                var total_uv_result = response.aggregations.result.buckets;
                var single_uv_result = getSingleUVResult();
                if (single_uv_result != null && total_uv_result != null) {
                    var result = [];
                    for (var i = 0, l = total_uv_result.length; i < l; i++) {
                        var obj = {};
                        if (total_uv_result[i].tuv.value === 0) {
                            obj["key"] = total_uv_result[i].key;
                            obj["rate"] = "0%";
                            result.push(obj);
                        } else {
                            obj["key"] = total_uv_result[i].key;
                            obj["rate"] = (parseFloat(single_uv_result[i].doc_count) / parseFloat(total_uv_result[i].tuv.value) * 100).toFixed(2) + "%";
                            result.push(obj);
                        }
                    }

                    callbackFn(result);
                }
            }
            else
                console.error(error);
        });

    }
};

module.exports = jump_rate;
