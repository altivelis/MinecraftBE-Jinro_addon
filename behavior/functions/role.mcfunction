function copyList
scoreboard players reset * role
scoreboard players set @a role 0
#scoreboard players set @e[type=armor_stand] role 0
function role/1
function role/2
function role/4
function role/5
function role/3
scoreboard players set "市民" roleList 0
execute as @a[scores={role=3}] run scoreboard players add "市民" roleList 1
