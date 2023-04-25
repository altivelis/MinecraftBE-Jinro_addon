import * as mc from "@minecraft/server"
import { runPlayer, runWorld } from "./runCommand";
const COLOR = ["white","orange","magenta","light_blue","yellow","lime","pink","gray","silver","cyan","purple","blue","brown","green","red","black"]
/**
 * 
 * @param {import('@minecraft/server').Block} block
 * @returns {Object}
 */
export function getGlass(block){
    let blockId = block?.typeId;
    if(!blockId || !blockId.match(/glass/)){
        return null;
    }
    let color = block.permutation.getProperty("color");
    return {blockId:blockId,color:color}
}
/**
 * 
 * @param {import('@minecraft/server').Block} origin 
 * @returns 
 */
export async function breakGlass(origin){
    let lists = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];
    let BlockList = [];
    let WhiteList = [[origin.x,origin.y,origin.z]];
    let originGlass = getGlass(origin);
    console.log(originGlass.color);
    runWorld(origin.dimension.id,`setblock ${origin.x} ${origin.y} ${origin.z} air [] destroy`);
    runWorld(origin.dimension.id,`summon altivelis:marker ${origin.x} ${origin.y} ${origin.z} 0 0 glass "${originGlass.blockId}${(originGlass.color)?`.${originGlass.color}`:""}"`);
    mc.system.run(function code(){
        for(let i=0;i<20;i++){
            if(WhiteList.length==0)return;
            const pos = WhiteList.shift();
            for(const [x,y,z] of lists){
                if(
                    BlockList.some(list=>list.toString() == [pos[0]+x,pos[1]+y,pos[2]+z].toString()) ||
                    WhiteList.some(list=>list.toString() == [pos[0]+x,pos[1]+y,pos[2]+z].toString())    
                ) continue;
                let block = origin.dimension.getBlock({x:pos[0]+x,y:pos[1]+y,z:pos[2]+z});
                let glass = getGlass(block);
                if(glass){
                    runWorld(block.dimension.id,`setblock ${block.x} ${block.y} ${block.z} air [] destroy`);
                    runWorld(block.dimension.id,`summon altivelis:marker ${block.x} ${block.y} ${block.z} 0 0 glass "${glass.blockId}${(glass.color)?`.${glass.color}`:""}"`);
                    WhiteList.push([block.x,block.y,block.z]);
                }else{
                    BlockList.push([block.x,block.y,block.z]);
                }
            }
        }
        mc.system.run(code);
    })
/*
    for(const pos of WhiteList){
        for(const [x,y,z] of lists){
            if(
                BlockList.some(list=>list.toString() == [pos[0]+x,pos[1]+y,pos[2]+z].toString()) ||
                WhiteList.some(list=>list.toString() == [pos[0]+x,pos[1]+y,pos[2]+z].toString()) //||
                //pos[0]+x-origin.x < -5 || pos[0]+x-origin.x > 5 ||
                //pos[1]+y-origin.y < -5 || pos[1]+y-origin.y > 5 ||
                //pos[2]+z-origin.z < -5 || pos[2]+z-origin.z > 5
            ) continue;
            let block = origin.dimension.getBlock(new mc.BlockLocation(pos[0]+x,pos[1]+y,pos[2]+z));
            let glass = getGlass(block);
            console.log(JSON.stringify(glass));
            if(glass){
                //runWorld(block.dimension.id,`setblock ${block.x} ${block.y} ${block.z} air 0 destroy`);
                //runWorld(block.dimension.id,`summon altivelis:marker ${block.x} ${block.y} ${block.z} glass "${glass.blockId}${(glass.id)?` ${glass.id}`:""}"`);
                WhiteList.push([block.x,block.y,block.z]);
            }else{
                BlockList.push([block.x,block.y,block.z]);
            }
        }
    }*/
}
/*export function breakGlass(block){
    let BlockList = Array();
    getGlassList(block,BlockList);
    console.log(BlockList);

    array.push(block.location);
    console.log(array);
    let glass = getGlass(block);
    console.log("run2");
    if(glass){
        block.run=true;
        let pos = block.location;
        let dimension = block.dimension
        runWorld(dimension.id,`setblock ${pos.x} ${pos.y} ${pos.z} air 0 destroy`);
        runWorld(dimension.id,`summon altivelis:marker ${pos.x} ${pos.y} ${pos.z} glass "${glass.blockId}${(glass.id)?` ${glass.id}`:""}"`)
        breakGlass(dimension.getBlock(pos.offset(0,0,-1)),array);
        breakGlass(dimension.getBlock(pos.offset(0,0,1)),array);
        breakGlass(dimension.getBlock(pos.offset(-1,0,0)),array);
        breakGlass(dimension.getBlock(pos.offset(1,0,0)),array);
        breakGlass(dimension.getBlock(pos.offset(0,1,0)),array);
        breakGlass(dimension.getBlock(pos.offset(0,-1,0)),array);
    }
}*/
export function repairGlass(dimension){
    let markerList = Array.from(dimension.getEntities({
        type:"altivelis:marker",
        tags:["glass"]
    }));
    mc.system.run(function code(){
        for(let i=0;i<30;i++){
            if(markerList.length==0)return;
            let marker = markerList.shift();
            if(marker.nameTag){
                let names = marker.nameTag.split(".",2);
                runPlayer(marker,`setblock ~~~ ${names[0]}${((names[1])?` ["color":"${names[1]}"]`:"")}`);
                runPlayer(marker,`kill @s`);
            }
        }
        mc.system.run(code);
    })
}

function getProperties(obj) {
    var properties = '';
    for (var prop in obj) {
        properties += prop + ': ' + obj[prop] + '\n';
    }
    return properties;
}