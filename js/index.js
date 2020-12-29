let exam;

$(document).ready(function () {
	//获取级联需要的json数据
	$.ajax({
		type: "get",
		url: api["info"],
		success: function (data) {
			if (data.message !== "success") {
				exam = {}
				$('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>无法获取数据，请尝试刷新').show().delay(1500).fadeOut());
			} else {
                exam = data['data'];
                for (let i in exam) {
                    $("#campus").append("<option value='" + i + "'>" + exam[i]['name'] + "</option>");
                }
			}
		},
		error: function () {
			$('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-danger').html('<strong>错误！</strong>无法获取数据，请尝试刷新').show().delay(1500).fadeOut());
		}
	});

	$("#campus").change(function () {
		//清空option
		let exam_id = $("#campus").find("option:selected").val();
		let examNameObject = $("#examName");
        examNameObject.find("option").remove();
        examNameObject.append("<option value='' selected>请选择考试</option>")
        for (let i of exam[exam_id]['list']) {
            examNameObject.append("<option value='" + i + "'>" + i + "</option>");
        }
	});
});
function GoQuery() {
    let campus = $("#campus").find("option:selected").val();
    let examName = $("#examName").find("option:selected").val();
    let studentCode = $("#studentCode").val();
    if (campus !== "" && examName !== "" && studentCode !== "") {
		window.location="query.html?campus=" + campus + "&examName=" + examName + "&studentCode=" + studentCode;
    } else {
        $('<div>').prependTo('body').addClass('row justify-content-center').html($('<div>').addClass('col-4 alert alert-warning').html('<strong>警告！</strong>信息不全，无法查询').show().delay(1500).fadeOut());
    }

}