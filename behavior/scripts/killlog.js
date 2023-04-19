import * as mc from "@minecraft/server";
import { getScore } from "./score";

mc.world.events.entityDie.subscribe(data=>{
    const status = getScore("test","status");
    if(status!=1)return;
    const {damageSource,deadEntity:hurter} = data;
    const {cause,damagingEntity:killer} = damageSource;
    const currentLog = mc.world.getDynamicProperty("killlog");
    let log;
    if(currentLog){
        log=currentLog+`\n§3${killer.nameTag}§e=>§4${hurter.nameTag}§2(${cause})`;
    }else{
        log=`§3${killer.nameTag}§e=>§4${hurter.nameTag}§2(${cause})`;
    }
    mc.world.setDynamicProperty("killlog",log);
},{entityTypes:["minecraft:player"]});

mc.system.events.scriptEventReceive.subscribe(data=>{
    const {id} = data;
    switch(id){
        case "altivelis:showLog":
            mc.world.sendMessage("§c～～キルログ～～")
            mc.world.sendMessage(mc.world.getDynamicProperty("killlog"));
            mc.world.setDynamicProperty("killlog","");
            break;
        case "altivelis:resetLog":
            mc.world.setDynamicProperty("killlog","");
            break;
    }
})