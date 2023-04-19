import * as mc from "@minecraft/server";

export const itemList = [
    {
        role:1,item:new mc.ItemStack("altivelis:wolf_axe"),keep:true,lock:true,cost:2,texture:"textures/items/stone_axe",
        lore:[
            "人狼専用アイテム",
            "一撃で相手を仕留めることができるが、大きな音が鳴る。",
            "この攻撃はクールダウンが発生しない。"
        ]
    },
    {
        role:1,item:new mc.ItemStack("altivelis:invisible_potion"),keep:true,lock:false,cost:4,texture:"textures/items/potion_bottle_invisibility",
        lore:[
            "人狼限定アイテム",
            "短時間だけ透明になることができる。",
            "モヤが見えるため注意。",
            "このアイテムは人に渡すことができる。"
        ]
    },
    {
        role:1,item:new mc.ItemStack("altivelis:smoke"),keep:true,lock:false,cost:1,texture:"textures/items/snowball",
        lore:[
            "人狼限定アイテム",
            "雪玉のように投げて使用。",
            "着弾地点に一定時間煙をまき散らす。",
            "このアイテムは人に渡すことができる。"
        ]
    },
    {
        role:1,item:new mc.ItemStack(mc.MinecraftItemTypes.filledMap),keep:true,lock:false,cost:4,texture:"textures/items/map_filled",
        lore:[
            "人狼限定アイテム",
            "生存者全員の居場所がわかる地図。",
            "このアイテムは人に渡すことができる"
        ]
    },
    {
        role:2,item:new mc.ItemStack("altivelis:magicbook"),keep:true,lock:true,cost:4,texture:"textures/items/book_writable",
        lore:[
            "狂人専用アイテム",
            "現在生存している人狼からランダムで1人が分かる。",
            "このアイテムは手に持っても周りから見えない。"
        ]
    },
    {
        role:4,item:new mc.ItemStack("altivelis:ohuda"),keep:true,lock:true,cost:4,texture:"textures/items/banner_pattern",
        lore:[
            "霊媒師専用アイテム",
            "死体に対して使用することで人狼かどうかを確かめることができる。",
            "このアイテムは手に持っても周りから見えない。"
        ]
    },
    {
        role:5,item:new mc.ItemStack("altivelis:crystal"),keep:true,lock:true,cost:4,texture:"textures/items/potion_bottle_splash",
        lore:[
            "占い師専用アイテム",
            "生存者から1人選んで人狼かどうかを確かめることができる。",
            "このアイテムは手に持っても周りから見えない。"
        ]
    },
    {
        role:0,item:new mc.ItemStack("altivelis:death_splash"),keep:false,lock:false,cost:2,texture:"textures/items/potion_bottle_splash",
        lore:[
            "火薬を詰めた危ない瓶。",
            "スプラッシュポーションと同じ投げ方をする。",
            "取り扱い注意。",
            "このアイテムは死亡時にドロップする。"
        ]
    },
    {
        role:0,item:new mc.ItemStack("altivelis:stun_grenade"),keep:false,lock:false,cost:4,texture:"textures/items/fireworks_charge",
        lore:[
            "雪玉のように投げて使用。",
            "当たると盲目と鈍足の効果が付く。",
            "スタン中も弓は撃てるので油断大敵。",
            "このアイテムは死亡時にドロップする。"
        ]
    },
    {
        role:0,item:new mc.ItemStack("altivelis:speed_potion"),keep:false,lock:false,cost:2,texture:"textures/items/potion_bottle_moveSpeed",
        lore:[
            "誰もお前を止められない。",
            "このアイテムは死亡時にドロップする。"
        ]
    },
    {
        role:0,item:new mc.ItemStack("altivelis:clairvoyance"),keep:false,lock:false,cost:3,texture:"textures/items/ender_eye",
        lore:[
            "使用するとその時存在している死体のネームタグが見えるようになる。",
            "後から死亡した人の名前は見えないので再度使用する必要がある。",
            "このアイテムは死亡時にドロップする。"
        ]
    },
];
