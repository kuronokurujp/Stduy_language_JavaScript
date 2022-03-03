try {
    var excel_app = WScript.CreateObject("Excel.Application");
    var book = excel_app.Workbooks.Open("create_table.xls");
    var sheet = book.WorkSheets("Sheet1");

    var csv_str = "";
    var row = 0;
    while(1) {
        if( sheet.Cells(1+row, 1).value == null ) {
            break;
        }

        var ary = new Array;
        var column = 0;
        while(1) {
            var str = sheet.Cells(1+row, 1+column);
            if( str.value == null ) {
                break;
            }
            ary.push(str);
            column++;
        }
        csv_str += ary.join(",") + "\n";
        row++;
    }
}
catch(e) {
    alert(e);
}
finally {
    book.Close();
    excel_app.Quit();
    excel_app = null;
}

// �t�@�C����������
var fs = WScript.CreateObject("Scripting.FileSystemObject");
fs.CreateTextFile("table.csv");
var file = fs.OpenTextFile("table.csv", 2, 0);
file.Write(csv_str);
file.Close();

