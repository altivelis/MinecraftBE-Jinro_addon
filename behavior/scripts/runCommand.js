import {
    world
} from "@minecraft/server";

/**
 * コマンド実行関数
 * @author altivelis1026
 * @param {import('@minecraft/server').dimension.id|string} dimension
 * @param {string} command
 * @returns {number|null}
 */
export function runWorld(dimension,command){
    world.getDimension(dimension).runCommandAsync(command);
}

/**
 * プレイヤーコマンド実行関数
 * @author altivelis1026
 * @param {import('@minecraft/server').Entity|import('@minecraft/server').Player} target
 * @param {string} command 
 */
export function runPlayer(target,command){
    target.runCommandAsync(command);
}