import * as mc from "@minecraft/server"

mc.world.beforeEvents.worldInitialize.subscribe(data=>{
  data.itemComponentRegistry.registerCustomComponent("altivelis:marker",{
    onUse(arg){
      let location = arg.source.location;
      location.x = Math.floor(location.x) + 0.5;
      location.z = Math.floor(location.z) + 0.5;
      arg.source.dimension.spawnEntity("altivelis:marker",location).triggerEvent(arg.itemStack.typeId.slice(17));
    }
  });
  data.itemComponentRegistry.registerCustomComponent("altivelis:bell",{
    onUse(arg){
      arg.source.dimension.playSound("note.bell",arg.source.location,{volume:3,pitch:1.5});
      mc.world.getPlayers({excludeTags:["death","spec"],scoreOptions:[{objective:"glow",maxScore:300}],location:arg.source.location,minDistance:0.1}).forEach(player=>{
        mc.world.scoreboard.getObjective("glow").setScore(player,300);
      })
    }
  });
  data.itemComponentRegistry.registerCustomComponent("altivelis:clairvoyance",{
    onUse(arg){
      arg.source.dimension.getEntities({type:"altivelis:dead_body"}).forEach(entity=>{
        entity.triggerEvent("visible");
      })
    }
  });
  data.itemComponentRegistry.registerCustomComponent("altivelis:invisible",{
    onConsume(arg){
      arg.source.addEffect("invisibility",400,{amplifier:0});
    }
  });
  //残りのアイテムもやってね★
})