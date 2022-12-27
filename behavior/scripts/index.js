import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { runPlayer, runWorld } from "./runCommand";
import { getScore } from "./score";

mc.world.events.entityHurt.subscribe(data=>{
    let hurter = data.hurtEntity;
    let health = hurter.getComponent("health").current;
    if(health<=0.0){
        runPlayer(hurter,`tag @s add death`);
        let role = getScore(hurter,"role");
        if(role){
            if(role==1){
                runPlayer(hurter,`summon altivelis:dead_body ~~~ wolf ${hurter.nameTag}`);
            }else{
                runPlayer(hurter,`summon altivelis:dead_body ~~~ human ${hurter.nameTag}`);
            }
        }
    }
},
{entityTypes:["minecraft:player"]})


//デバッグを開始
//"/script debugger connect localhost 19144"