import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';

async function f_setHandi(player){
    let form = new ui.ModalFormData().title("ハンデ設定")
    const playerList = mc.world.getAllPlayers();
    for(const p of playerList){
        form.slider(p.nameTag,0,0,1)
        .toggle("矢の弱体化",p.hasTag("handi1"))
        .toggle("矢のクールダウン増加",p.hasTag("handi2"))
        .toggle("キルクールダウン",p.hasTag("handi3"));
    }
    const result = await form.show(player);
    if(result.canceled)return;
}