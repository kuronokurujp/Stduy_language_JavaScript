/**
 *	@file 	Sample.cpp
 *	@brief	入力したファイルの暗号化
 *	@author	yuto uchida
 *	@data   2011-03-30
 */
#include <stdio.h>
#include <string.h>
#include <tchar.h>

int _tmain(int argc, _TCHAR* argv[])
{
    if(argc < 3) {
        printf("Lack of Argument\n");
        printf("SampleEccrypt inputPath outputPath");
        return	-1;
    }

    // ファイルを開く
    FILE* pInputFile = NULL;
    const char*	pInputPath = argv[1];
    {
        fopen_s(&pInputFile, pInputPath, "rb");
        if(pInputFile == NULL) {
            printf("Failed to open input path.[%s]\n", pInputPath);
            return -1;
        }
    }

    // 暗号ファイルを作る
    FILE* pOutputFile = NULL;
    {
        const char*	pOutputPath	= argv[2];
        fopen_s(&pOutputFile, pOutputPath, "wb");
        if(pOutputFile == NULL) {
            printf("Failed to open output path.[%s]\n", pOutputPath);
            fclose(pInputFile);
            return -1;
        }
    }

    printf("Start Encrypting %s... ", pInputPath);
    // 暗号元のファイルサイズを取得
    fseek(pInputFile, 0, SEEK_END);
    unsigned	sz	= ftell( pInputFile );
    // ファイルサイズを取得したので変更した設定を元に戻す
    fseek( pInputFile, 0, SEEK_SET );

    // 1byteずつデータを取得して、そのデータに暗号処理をして暗号ファイルに書き込む
    // 暗号といっても1byteのデータをプラスしているだけだが
    {
        unsigned char* pOutBuf = new unsigned char[ sz ];
        ::memset(pOutBuf, 0, sizeof( char ) * sz);
        for(unsigned i = 0; i < sz; ++i) {
            unsigned char c	= 0;
            fread(&c, 1, 1, pInputFile);
            pOutBuf[i] = (++c);
        }

        fwrite(pOutBuf, sz, 1, pOutputFile);

        delete pOutBuf;
        pOutBuf	= NULL;
    }

    fclose(pInputFile);
    fclose(pOutputFile);

    printf("done.\n");

    return 0;
}
