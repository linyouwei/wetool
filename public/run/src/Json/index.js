$(function(){
    var domain = 'http://localhost:4001/'
    $("#jsonInput").blur(function(){
//        var json_data = $("#jsonInput").val();
//        console.log(json_data);
        data2 = '{"a":{"b":{"a":{"b":123}}}}';
        var temp = '';
        var count = 0;//计算\t的个数
        var brace_cout = 0;//计算{的个数
        function output(data){
            var start = data.indexOf("{");
            //"b":123
            if(start==-1){
                temp = data.substring(data.indexOf(":")+1);
                return temp;
            }else {
                var end = data.lastIndexOf("}")
                var tempData = data.substring(start + 1, end);
                //从tempData中截取:前面的数值。
                var contentIndex = tempData.indexOf(":");
                var content = tempData.substring(1, contentIndex + 1);
                count++;
                var space = '';
                for (var j = 0; j < count; j++) {
                    space += "\t";
                }
                var brace_space =''
                if(brace_cout){
                    for (var i = 0; i < brace_cout; i++) {
                        brace_space +='\t'
                    }
                    brace_space  += '}'
                }else{
                    brace_space = '}'
                }
                brace_cout++;
                //拼接{ }s
                temp = "{<br/>"+space+ content+output(tempData)+"<br/>"+brace_space;
                return temp;
            }
        }
        output(data2);
        $("#outPut pre").html(temp);


    })


})