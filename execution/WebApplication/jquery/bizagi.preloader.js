function mapVariables(params) {
    var self=this, i=0, j, length = params.length, pLength, param, result="", temp, prop;
    var vars = ["language", "enable-log", "inbox-rows-per-page", { "default-currency-info": ["symbol", "decimalSeparator", "groupSeparator", "decimalDigits"] },
        { "default-datetime-info": ["shortDateFormat", "timeFormat", "longDateFormat", "twoDigitYearMax", "twoDigitYearMaxDelta"] },
        { "settings": ["UploadMaxFileSize", "skipSubprocessGlobalForm"] }, "user-preferences-page", "session-name"];

    for (; i < length; ) {
        param = params[i];
        switch (Object.prototype.toString.apply(param)) {
            case "[object Array]":
                for (prop in vars[i]) { if (vars[i].hasOwnProperty(prop)) { temp = prop; break; } }
                result += self.tform(temp) + " = {\n";
                pLength = param.length;
                for (j = 0; j < pLength; j++) {
                    if (j < pLength - 1) {
                        result += "\t" + vars[i][temp][j] + ": " + '"' + param[j] + '"' + ",\n";
                    } else {
                        result += "\t" + vars[i][temp][j] + ": " + '"' + param[j] + '"' + "\n";
                    }
                }
                result += "};\n";
                break;
            case "[object String]":
                param = '"' + param + '"';
                result += self.tform(vars[i]) + " = " + param + ";\n";
                break;
            case "[object Boolean]":
                result += self.tform(vars[i]) + " = " + param + ";\n";
                break;
        }
        i++;
    }

    if (result !== ""){        
        eval(result);
    }

}
