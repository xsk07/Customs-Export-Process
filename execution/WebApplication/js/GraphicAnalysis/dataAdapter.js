function DataAdapter() {

    /**
     * Adjust the array of data and the last dimension is placed first
     * @param {*} json 
     */
    var _adjustPriority = function (json) {
        var index = json.ExtendedProperties.LastSelectedDimension,
            _needSort = json.Columns[index].ColumnName.indexOf("_M") === -1,
            _sortData = function(json) {
                json.Columns = _posItems2First([index], json.Columns);
                json.Rows = json.Rows.map(_posItems2First.bind(null, [index]));
                json.ExtendedProperties.LastSelectedDimension = 0;
                return json;
            };
        return _needSort ? _sortData(json) : json;
    };
    
    /**
     * returns the data ordered by the last selected dimension
     * @param {*} json 
     */
    var _reorderArray = function (json) {
        return _orderRowsColumns(json);
    };

    /**
     * returns the bar, line and stacked charts tooltip
     * @param {*} array 
     */
    var _createTooltip = function (array) {
        var tooltip = '';
        array.map(function (element) {
            tooltip += getFriendlyName(element.item) + ": [bold]" + element.value + "[/]\n";
        })
        return tooltip;
    };
    /**
     * when is month the extended property is copied from year
     */
    var _adjustMonthMergeProperty = function (dataColumns) {
        var year = dataColumns.find(function (c) { return c.ColumnName.indexOf("_Y") !== -1 });
        return dataColumns.map(function (col) {
            var _haveYear = year !== undefined,
                _isMonth = col.ColumnName.indexOf("_M") !== -1;
            if (_haveYear && _isMonth) {
                col.ExtendedProperties = year.ExtendedProperties;
            }
            return col;
        });
    };

    /**
     * change position of item of an array
     * @param {Array} arr 
     * @param {Int} oldd 
     * @param {Int} neww 
     */
    var _moveTo = function (arr, oldd, neww) {
        var e = arr[oldd],
            _neww = oldd < neww ? neww + 1 : neww,
            _old = oldd > neww ? oldd + 1 : oldd,
            _added = arr.slice(0, _neww).concat([e]).concat(arr.slice(_neww)),
            _removed = _added.slice(0, _old).concat(_added.slice(_old + 1));
        return _removed;
    };

    /**
     * return all indexes Date type if the last selected is Date else just return the lastSelected
     * @param {JSON} json 
     */
    var _getDateIndexToSort = function (json) {
        var _lastSelected = json.ExtendedProperties.LastSelectedDimension,
            _column = json.Columns[_lastSelected],
            _isMonth = _column.ColumnName.indexOf("_M") !== -1;            
            _STR_DATE = _isMonth ? "_M" : "_Y",
            _dateIndexStr = _column.ColumnName.indexOf(_STR_DATE),
            _isDate = _dateIndexStr !== -1,
            _dateName = _column.ColumnName.substr(0, _dateIndexStr),
            _allDateIndex2Sort =
                json.Columns
                    .map(function (item, i) { return { index: i, dat: item }; })
                    .filter(function (item) { return item.dat.ColumnName.indexOf(_dateName) !== -1 })
                    .map(function (item) { return item.index; });
        return _isDate ? _allDateIndex2Sort : [_lastSelected];
    };

    /**
     * move the data items in indexes to first position
     * @param {Array} indexes 
     * @param {Array} data 
     */
    var _posItems2First = function (indexes, data) {
        var _move2First = function (_dataIn, _indexToSort, i) {
            return _moveTo(_dataIn, _indexToSort + i, 0);
        };

        return indexes
            .concat([])
            .reverse()
            .reduce(_move2First, data);
    };

    /**
     * find old and new position for the year of a month column to sort
     * and omit the month in the monthsSorted list
     * @param {Array} jsonCols 
     * @param {Array} monthsSorted 
     */
    var _findColPosYear2Sort = function (jsonCols, monthsSorted) {
        var _result = function (month, old) {
                return {
                    old: old,
                    new: month.index,
                    month: month.dat.ColumnName
                };
            },
            _findColName = function (cols, name) {
                return cols
                    .map(function (e, index) { return { index: index, dat: e}; })
                    .find(function (c) { return c.dat.ColumnName === name; });
            },
            _start = function (res, col, i, columns) {
                var _stop = res !== undefined,
                    _posStr = col.ColumnName.indexOf("_Y"),
                    _nameInMonth = col.ColumnName.substr(0, _posStr) + "_M",
                    _alreadySorted = monthsSorted.indexOf(_nameInMonth) !== -1,
                    _foundedYear = !_stop && _posStr !== -1 && !_alreadySorted,
                    _foundedMonth =_findColName(columns, _nameInMonth);
                        
                return (_foundedYear && _foundedMonth) ? _result(_foundedMonth, i) : res;
            };

        return jsonCols.reduce(_start, undefined);
    }

    /**
     * sort columns for put Years nest to Months
     * @param {JSON} json 
     * @param {Array} memoMonth months founded
     */
    var _yearsWithMonths = function (json, memoMonth) {
        var _pos2Sort = _findColPosYear2Sort(json.Columns, memoMonth),
            _founded = _pos2Sort !== undefined,
            _newCols = _founded ? _moveTo(json.Columns, _pos2Sort.old, _pos2Sort.new) : json.Columns,
            _newRows = _founded ? json.Rows.map(function (colsInRows) {
                return _moveTo(colsInRows, _pos2Sort.old, _pos2Sort.new);
            }) : json.Rows,
            _newMemo = _founded ? memoMonth.concat([_pos2Sort.month]) : memoMonth;

        json.Columns = _newCols;
        json.Rows = _newRows;
        return _founded ? _yearsWithMonths(json, _newMemo) : json;
    }

    /**
     * start to sort columns and rows
     * @param {JSON} json 
     */
    var _orderRowsColumns = function (json) {
        var _columIndex = json.Columns[json.ExtendedProperties.LastSelectedDimension].ColumnName,
            _json = _yearsWithMonths(json, []),
            _index2Sort = _getDateIndexToSort(_json),
            _newCols = _posItems2First(_index2Sort, _json.Columns),
            _newRows = _json.Rows.map(_posItems2First.bind(null, _index2Sort))
            _newIndex =json.ExtendedProperties.LastSelectedDimension;

        _json.Rows = _newRows;
        _json.Columns = _newCols;
        for (var index = 0; index <  _json.Columns.length; index++) {
            if(_json.Columns[index].ColumnName.indexOf(_columIndex) !== -1){
                _newIndex = index;
            }            
        }
        _json.ExtendedProperties.LastSelectedDimension = _newIndex;
        return _json;
    };


    /**
     * adapter to bar line and stacked charts
     * @param {*} json 
     */
    var _adaptData = function (json) {
        json.Columns = _adjustMonthMergeProperty(json.Columns);
        arrayTooltip = [];
        return json.Rows.map(function (row, rowIndex) {
            var item = {},
                name = '',
                value = '',
                saved = false,
                numberDimensions = 0;
            json.Columns.map(function (col, index) {
                var itemValue =  row[index] === null ? '' : row[index];
                if (col.ExtendedProperties.Merge !== true && saved == false) {
                    item[name] = value;
                    saved = true;
                }
                else if (col.ExtendedProperties.Merge === true && saved == false) {
                    name += name.length === 0 ? col.ColumnName : '±' + col.ColumnName;
                    value += value.length === 0 && numberDimensions === 0 ? _preventEmptyString(col, itemValue) : '±' + itemValue;
                    arrayTooltip.push({ item: col.ColumnName, value: itemValue});
                    numberDimensions++;
                }
                if (col.ExtendedProperties.Merge !== true && saved === true) {
                    item[col.ColumnName] = Number(row[index]);
                }
            });
            item['tooltip'] = _createTooltip(arrayTooltip);
            arrayTooltip = [];
            return item
        })
    };

    /**
     * Fix max recursion error with amcharts. Prevent empty string. TM09499
     * @param {*} json 
     */
     var _preventEmptyString = function (column, itemValue) {
        if(column.DataType === 'String' && itemValue === ''){
            return '_';
        }
        return itemValue;
     };

    /**
     * Adapter to pie chart data
     * @param {*} json 
     */
    var _adaptDataPie = function (json) {
        json.Columns = _adjustMonthMergeProperty(json.Columns);
        var formattedData = {},
            cols = json.Columns,
            rows = json.Rows;

        for (var i = 0; i < cols.length; i++) {
            var measureData = [];
            for (var k = 0; k < rows.length; k++) {
                var measureDataItem = {};
                for (var j = 0; j < cols.length; j++) {
                    if (cols[j].ExtendedProperties.Merge === true) {
                        measureDataItem[cols[j].ColumnName] = rows[k][j];
                    } else if (cols[j].ExtendedProperties.Merge !== true && cols[j].ColumnName === cols[i].ColumnName) {
                        measureDataItem[cols[j].ColumnName] = rows[k][j];
                    }
                }
                var nameMeasure = cols[i].ColumnName;
                measureDataItem[nameMeasure] = rows[k][i]
                measureData.push(measureDataItem);

            }
            if (cols[i].ExtendedProperties.Merge !== true) {
                formattedData[cols[i].ColumnName] = measureData;
            }
        }
        return formattedData;
    };

    var _startAdapter = function  (json) {
        _adjustPriority(json);
        _reorderArray(json);
        return json;
    }

    /**
     * returns the chart title
     * @param {*} json 
     */
    var _getTitle = function (json) {
        var title = '';
        var subTitle = getFriendlyName(json.Columns[json.ExtendedProperties.LastSelectedDimension].ColumnName);
        json.Columns.map(function (col, index) {
            title += col.ExtendedProperties.Merge === true ? getFriendlyName(col.ColumnName) : '';
            title += json.Columns[index + 1] && json.Columns[index + 1].ExtendedProperties.Merge ? ' - ' : '';
        })
        return { title: title, subTitle: subTitle };
    };

    return {
        adaptData: function (json) {
            return json.Rows.length === 0 ? [] : _adaptData(_startAdapter(json));
        },
        adaptDataPie: function (json) {
            return json.Rows.length === 0 ? [] : _adaptDataPie(_startAdapter(json));
        },
        getTitle: function (json) {
            return json.Rows.length === 0 ? [] :_getTitle(_reorderArray(json));
        },
    };
}
