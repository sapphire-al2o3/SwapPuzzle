SwapPuzzle
==========

http://sapphire-al2o3.github.io/SwapPuzzle

### Jadeでのページ生成方法

問題を書いたJSONを用意して

```
> jade -P -O q21.json .\swap_piece.jade && ren swap_piece.html swap_piece_21.html
```

PowerShellの場合

```
> (jade -P -O q21.json .\swap_piece.jade) -AND (ren swap_piece.html swap_piece_21.html)
```