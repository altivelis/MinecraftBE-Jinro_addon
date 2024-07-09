import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import { runPlayer } from "./runCommand";
import { getScore } from "./score";
import { f_help_uranai } from "./roleBook";
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
    form.show(user).then(async res=>{
        if(res.canceled)return;
        let index = res.selection;
        let target = playerList[index];
        let tagList = target.getTags();
        let text = "";
        if(tagList.includes("death")){
            text = `§b${target.nameTag}§dは§c死亡している§5ため、占うことができません`
        }else{
            let role = getScore(target,"role");
            if(role==1){
                text = `§b${target.nameTag}§dは§4人狼です`;
            }else{
                text = `§b${target.nameTag}§dは§a人狼ではありません`;
            }
        }
        user.sendMessage("§d[占い]"+text);
        let result_form = new ui.MessageFormData()
            .title("§l§d占い結果")
            .body(text)
            .button2("ヘルプ:占い結果について")
            .button1("OK");
        user.getComponent(mc.EntityInventoryComponent.componentId).container.setItem(user.selectedSlotIndex);
        while(1){
            const res2 = await result_form.show(user);
            if(res2.canceled || res2.selection==0)return;
            const res3 = await f_help_uranai.show(user);
            if(res3.canceled) return;
        }
    })
}
