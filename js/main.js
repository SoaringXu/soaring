urls = [
    ["记忆大师", "./memory-master.html"],
    ["俄罗斯方块", "./urls/tetris.html"],
    ["字幕图片", "./urls/subtitle_generator.html"],
    ["滑块挑战", "./urls/slider-challenge.html"],
    ["生命起源", "./urls/life_simulation.html"],
    ["幻术图片", "./urls/mix_png.html"],
    ["叠塔游戏", "./towers.html"],
    ["互联网黑话", "./blackwords.html"],
]
for (var i = 0; i < urls.length; i++) {
    var a = `<a href="${urls[i][1]}" class="link-item">${urls[i][0]}</a>`
    $("#links-container").append(a)
}
