import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { runPlayer } from "./runCommand";
import { getScore } from "./score";
/**
 * @author altivelis1026
 * @param {import('@minecraft/server').Player} user 
 */
export function uranaiForm(user){
    let playerList = Array.from(mc.world.getPlayers({scoreOptions:[
        {
            exclude:false,
            maxScore:5,
            minScore:1,
            objective:"role"
        }
    ]}))
    let form = new ui.ActionFormData()
        .title("占い")
        .body("§c§l※すでに死亡している人は占えません");
    playerList.forEach(player=>{
        form.button(`${player.nameTag}`);
    })
    form.show(user).then(res=>{
        let index = res.selection;
        let target = playerList[index];
        let tagList = target.getTags();
        if(tagList.includes("death")){
            runPlayer(user,`tellraw @s {"rawtext":[{"text":"§d[占い]§b${target.nameTag}§dは§c死亡している§5ため、占うことができません"}]}`)
        }else{
            let role = getScore(target,"role");
            if(role==1){
                runPlayer(user,`tellraw @s {"rawtext":[{"text":"§d[占い]§b${target.nameTag}§dは§4人狼です"}]}`);
            }else{
                runPlayer(user,`tellraw @s {"rawtext":[{"text":"§d[占い]§b${target.nameTag}§dは§a人狼ではありません"}]}`);
            }
        }
        runPlayer(user,`replaceitem entity @s slot.weapon.mainhand 0 air 1 0`);
    })
}