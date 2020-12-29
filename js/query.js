function GetRequest() {
    let url = decodeURI(location.search); //获取url中"?"符后的字符串
    let theRequest = {};
    let strs;
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1);
        strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
let info = GetRequest();
let campus = info["campus"];
let examName = info["examName"];
let studentCode = info["studentCode"];
$.ajax({
    type: "get",
    url: api["grades"] + "?campus=" + campus + "&examName=" + examName + "&studentCode=" + studentCode,
    success: function (data) {
        if (data.message !== "success") {
            if (data.message === "studentCode wrong length") {
                exam = {}
                $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>考号填写错误，请检查后重新查询').show().delay(1500).fadeOut());
            } else if (data.message === "campus did not exist") {
                exam = {}
                $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>校区不存在').show().delay(1500).fadeOut());
            } else if (data.message === "exam did not exist") {
                exam = {}
                $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>考试不存在').show().delay(1500).fadeOut());
            } else if (data.message === "Request UpstreamAPI error") {
                exam = {}
                $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>请求上级出错，请检查考号并等待后重试').show().delay(1500).fadeOut());
            } else {
                $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>未知错误').show().delay(1500).fadeOut());
            }
        } else {
            let htmlbody = "<p>考号: " + studentCode + " 班级: " + data['data']['exam']['class'] + " 本次考试共" + data['data']['exam']['total'] + "人参加" + "</br>" +
                "总分: " + data['data']['grades']['all']['Score'] + " 等级: " + data['data']['grades']['all']['grade'] +
                " 班均分: " + data['data']['grades']['all']['classAvg'] + " 级均分: " + data['data']['grades']['all']['schoolAvg'] + "<br>";
            for (let i in data['data']['grades']['subjects']) {
                htmlbody += (data['data']['grades']['subjects'][i]['km'] + " " + data['data']['grades']['subjects'][i]['score'] + " " + data['data']['grades']['subjects'][i]['grade'] + "<br>")
            }
            htmlbody += ("</p><br><button type=\"button\" onclick=\"window.history.back()\">返回</button><br><br><div class=\"spoiler\"><div class=\"spoilerheader\"><input type=\"button\"class=\"spoilerbutton\"value=\"展开 / 收起隐藏错题得分情况\"onclick=\"n = this.parentNode.parentNode.lastChild;if(n.style.display === 'none') {n.style.display = 'block';} else {n.style.display = 'none';} return false;\"></div><div class=\"spoilerbody\"style=\"display: none;border-style:inset;padding-right:5px;border-color: #ccc; \">");
            for (let i in data['data']['questions']) {
                htmlbody += ("<p>" + i + "错题得分<table border=1><tr><td>题号</td><td>得分</td>")
                for (let n in data['data']['questions'][i]) {
                    if (data['data']['questions'][i][n]['Score'] !== data['data']['questions'][i][n]['totalScore']) {
                        htmlbody += ("<tr><td>" + data['data']['questions'][i][n]['TH'] + "</td><td>" + data['data']['questions'][i][n]['Score'] + "</td></tr>");
                    }
                }
                htmlbody += ("</table></p><br><br>");
            }
            htmlbody += ("</div></div>")
            let body = $("body");
            body.html(htmlbody);
            body.css("background", "");
        }

    },
    error: function () {
        $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>无法获取数据，请尝试刷新').show().delay(1500).fadeOut());
    }
});