# SIT Bus Data CSV Generator (SBDCG)

芝浦工業大学の[学バス時刻表データ](http://bus.shibaura-it.ac.jp/db/bus_data.json)を CSV ファイルに変換するツールです。

## 使い方

### (1) Deno を利用する場合

> [!WARNING]
> あらかじめ [Deno](https://deno.com/) をインストールしている必要があります。

このリポジトリを clone した後，以下のコマンドを実行してください。`csv` フォルダーの中に各種 CSV ファイルが生成されます。

```
deno task csv
```

### (2) 実行ファイルを利用する場合

> [!NOTE]
> 現在は Windows 用の `exe` ファイルのみを提供しています。

Releases のところから，`sbdcg_windows_x86_64.exe` をダウンロードしてください。その実行ファイルをダブルクリックすると，`csv` フォルダーの中に各種 CSV ファイルが生成されます。

## LICENSE

- MIT License (cf. [`LICENSE`](LICENSE))
