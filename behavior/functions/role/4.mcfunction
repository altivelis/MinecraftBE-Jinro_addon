tag * remove role
tag @r[scores={role=0}] add role
execute as @a[tag=role] if entity @s if score "霊媒師" roleList2 matches 1.. run scoreboard players set @s role 4
execute as @a[tag=role] if entity @s if score "霊媒師" roleList2 matches 1.. run scoreboard players add "霊媒師" roleList2 -1
execute if entity @a[tag=role] if score "霊媒師" roleList2 matches 1.. run function role/4
