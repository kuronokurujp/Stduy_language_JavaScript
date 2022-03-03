var	fs	= new ActiveXObject( "Scripting.FileSystemObject" );

var filePathArray	= [];

var	folderObj	= fs.GetFolder( "resource" );

var	files		= new Enumerator( folderObj.Files );
while( !files.atEnd() ) {
    var	filePath	= files.item();
    filePathArray.push( filePath );

    files.moveNext();
}

for( var i = 0; i < filePathArray.length; ++i ) {
    var	outputPath	= fs.GetFileName( filePathArray[ i ] ) + "enc";
    WScript.Echo( outputPath );
}
