# サーバー崩壊ラプソディ

https://238sakurai.github.io/game-server-love/

**~ Server Crash Rhapsody ~**

ITエンジニアのための、偏差値低め・思想弱め・でもちょっと愛があるクソゲー

## 遊び方

1. **TAP TO START** でゲーム開始
2. サーバーをタップして負荷を与える
3. CPU、メモリ、ネットワーク、ディスクの指標が上昇
4. しきい値を超えるとサーバーが**崩壊**
5. スコアを確認して **REBOOT**

## 特徴

- **同じパターンは二度と出ない** - すべてがランダム生成
- **6種類の崩壊演出** - 爆発、フリーズ、散乱、BSOD、無言消滅、グリッチ
- **8bitサウンド** - Web Audio APIで生成
- **スマホ最適化** - タッチ操作対応

## GitHub Pages

以下のURLで遊べます：

```
https://[username].github.io/[repository]/
```

## ローカル実行

```bash
# 任意のHTTPサーバーで起動
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開く

## 注意事項

- 学びは求めません
- SRE思想は捨ててください
- 本番環境では遊ばないでください

---

*「原因は後で調べます」*
