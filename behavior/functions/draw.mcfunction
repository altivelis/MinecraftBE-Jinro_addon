titleraw @a title {"rawtext":[{"text":"§3全滅しました"}]}
scoreboard players set "test" status 2
tellraw @a {"rawtext":[{"text":"§6～～引き分け～～"}]}
tellraw @a {"rawtext":[{"text":"・役職配分"}]}
tellraw @a {"rawtext":[{"text":"§4人狼§f:§g"},{"selector":"@a[scores={role=1}]"}]}
execute if score "狂人" roleList matches 1.. run tellraw @a {"rawtext":[{"text":"§7狂人§f:§g"},{"selector":"@a[scores={role=2}]"}]}
execute if score "市民" roleList matches 1.. run tellraw @a {"rawtext":[{"text":"§a市民§f:§g"},{"selector":"@a[scores={role=3}]"}]}
execute if score "霊媒師" roleList matches 1.. run tellraw @a {"rawtext":[{"text":"§3霊媒師§f:§g"},{"selector":"@a[scores={role=4}]"}]}
execute if score "占い師" roleList matches 1.. run tellraw @a {"rawtext":[{"text":"§5占い師§f:§g"},{"selector":"@a[scores={role=5}]"}]}
scriptevent altivelis:showLog
tellraw @a {"rawtext":[{"text":"§b10秒後にホームへ戻ります…"}]}
