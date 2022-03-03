var	fs	= new ActiveXObject( "Scripting.FileSystemObject" );
var	wsh	= new ActiveXObject( "WScript.Shell" );

var	filePathArray	= [];

var	folderObj	= fs.GetFolder( "resource" );
var	files		= new Enumerator( folderObj.Files );
while( !files.atEnd() ) {
	var	filePath	= files.item();
	filePathArray.push( filePath );

	files.moveNext();
}

for( var i = 0; i < filePathArray.length; ++i ) {
	var	outputPath	= "encrypted\\" + fs.GetFileName( filePathArray[ i ] ) + "enc";

	var	exec	= wsh.exec( "Sample.exe " + filePathArray[ i ] + " " + outputPath );

	while( exec.Status == 0 ) {
		WScript.Echo( exec.StdOut.ReadAll() );
		WScript.Sleep( 10 );
	}

	if( exec.Status.ExitCode == 0 ) {
		WScript.Echo( "-> " + outputPath + "[" + exec.Status + "]" );
	}
}