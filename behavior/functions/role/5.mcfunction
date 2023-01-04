tag * remove role
tag @r[scores={role=0},tag=!spec] add role
execute as @a[tag=role] if entity @s if score "占い師" roleList2 matches 1.. run scoreboard players set @s role 5
execute as @a[tag=role] if entity @s if score "占い師" roleList2 matches 1.. run scoreboard players add "占い師" roleList2 -1
execute if entity @a[tag=role] if score "占い師" roleList2 matches 1.. run function role/5
