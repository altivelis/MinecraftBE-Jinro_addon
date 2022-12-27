execute as @e[type=arrow,tag=!hit] at @s run particle minecraft:explosion_particle ~ ~ ~
execute if entity @a[hasitem={item=altivelis:marker_white,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=white] at @s run particle minecraft:balloon_gas_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_red,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=red] at @s run particle minecraft:redstone_wire_dust_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_purple,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=purple] at @s run particle minecraft:eyeofender_death_explode_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_blue,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=blue] at @s run particle minecraft:water_wake_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_yellow,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=yellow] at @s run particle minecraft:basic_flame_particle ~~~

#status:0=ホーム,1=ゲーム中,2=リザルト
execute if score "test" status matches 1 run function judge
