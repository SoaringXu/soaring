urls = [
    ["滑块挑战", "./urls/slider-challenge.html"],
    ["生命起源", "./urls/life_simulation.html"],
    ["幻术图片", "./urls/mix_png.html"],
    ["叠塔游戏", "./towers.html"],
    ["互联网黑话", "./blackwords.html"],
]
for (var i = 0; i < urls.length; i++) {
    var a = "<span><a href='" + urls[i][1] + "'>" + urls[i][0] + "</a></span>"
    $("#main").append(a)
}
