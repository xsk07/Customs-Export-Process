

/*---------------------------------------------------------------------------------------
Table utils:
  
'GetReportTable' function returns a dom table object with the "AnalysisResultTable" 
class applied, based on a given JSON datatable object (srctable).
  
The received src table object must have the following structure:

1- rows: Array of array of strings
         
2- columns: Array of the following JSON object:
- columnName: string
- caption: string
- (opt) extendedProperties: JSON object
- (opt) isHeader: string ("True"/"False", case insensitive)
- (opt) isVisible: string ("True"/"False", case insensitive)

3- (opt) extendedProperties: JSON object with result specific metadata
  

---------------------------------------------------------------------------------------*/

function GetReportTable(srcTable, bDrawColumnNames) {

    var oRow, oCell;
    var i, j;

    //Create table structure
    var oTable = $("<table></table>");
    var oTHead = $("<thead></thead>");
    var oTBody = $("<tbody></tbody>");

    oTable.append(oTHead);
    oTable.append(oTBody);


    //Create header row if necessary
    if (bDrawColumnNames) {

        //Create header row
        oRow = $("<tr></tr>");
        oTHead.append(oRow);

        // Create and insert cells into the header row.
        for (i = 0; i < srcTable.columns.length; i++) {
            //Do not draw invisible columns
            if (srcTable.columns[i].extendedProperties && srcTable.columns[i].extendedProperties.visible && srcTable.columns[i].extendedProperties.visible.toLowerCase() == "false")
                continue;

            oCell = $("<th></th>");
            oCell.html(srcTable.columns[i].caption);
            oRow.append(oCell);
        }
    }

    // Insert rows and cells into table body.
    for (i = 0; i < srcTable.rows.length; i++) {
        oRow = $("<tr></tr>");
        oTBody.append(oRow);
        for (j = 0; j < srcTable.rows[i].length; j++) {
            //Do not draw invisible columns
            if (srcTable.columns[j].extendedProperties && srcTable.columns[j].extendedProperties.visible && srcTable.columns[j].extendedProperties.visible.toLowerCase() == "false")
                continue;

            //Apply header style if necessary
            if (srcTable.columns[j].extendedProperties && srcTable.columns[j].extendedProperties.isHeader && srcTable.columns[j].extendedProperties.isHeader.toLowerCase() == "true")
                oCell = $("<th></th>");
            else
                oCell = $("<td></td>");

            //Draw cell content
            var oCellContent = $("<div></div>").css("display", "inline-block");
            oCellContent.html(srcTable.rows[i][j].text);
            oCell.append(oCellContent);
            oRow.append(oCell);
        }
    }

    //Apply style to table
    oTable.addClass("AnalysisResultTable");

    return oTable;
}

/*---------------------------------------------------------------------------
// Get zero-based index for a column in the table object, based on its name
----------------------------------------------------------------------------*/
function GetTableColumnIndex(srcTable, sColumnName, countOnlyVisibleColumns) {
    var iHiddenColumns = 0;

    for (i = 0; i < srcTable.columns.length; i++) {
        if (srcTable.columns[i].columnName.toLowerCase() == sColumnName.toLowerCase()) {
            return i - iHiddenColumns;
        }
        //Do not draw invisible columns
        if (countOnlyVisibleColumns && srcTable.columns[i].extendedProperties && srcTable.columns[i].extendedProperties.visible && srcTable.columns[i].extendedProperties.visible.toLowerCase() == "false")
            ++iHiddenColumns;
    }

    return -1;
}


/*---------------------------------------------------------------------------
// Get zero-based index for a column in the dom table, based on its index 
// in the source table object
----------------------------------------------------------------------------*/
function GetPrintedTableColumnIndex(srcTable, iDataTableIndex) {

    var iHiddenColumns = 0;

    for (i = 0; i < iDataTableIndex; i++) {
        if (srcTable.columns[i].extendedProperties && srcTable.columns[i].extendedProperties.visible && srcTable.columns[i].extendedProperties.visible.toLowerCase() == "false")
            ++iHiddenColumns;
    }

    return iDataTableIndex - iHiddenColumns;
}


