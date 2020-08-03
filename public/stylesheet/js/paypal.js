var IMP = window.IMP; // 생략가능
IMP.init('imp27331670'); //

function paypal(str){
    var data = JSON.parse(str);
    var name = data.name.replace('<br>', '/n')
    IMP.request_pay({
        pg : 'paypal', // version 1.1.0부터 지원.
        pay_method : 'card',
        merchant_uid : 'Autoinmall_' + new Date().getTime(),
        name : "Order",
        amount : data.total,
        buyer_email : data.email,
        buyer_name : data.name,        
        buyer_addr : data.address,
        buyer_postcode : data.zipcode,
        custom_data : name,
        m_redirect_url : 'https://www.autoinmall.com/payments/complete',
    }, function(rsp) {
        if ( rsp.success ) {
            //[1] 서버단에서 결제정보 조회를 위해 jQuery ajax로 imp_uid 전달하기
            jQuery.ajax({
                url: 'https://www.autoinmall.com/payments/complete', //cross-domain error가 발생하지 않도록 동일한 도메인으로 전송
                type: 'POST',
                dataType: 'json',
                data: {
                    imp_uid : rsp.imp_uid // 고유ID
                }
    
            }).done(function(data) {
                //console.log(data);
    /*
                var msg = '결제가 완료되었습니다.';
                msg += '\n\n고유ID : ' + rsp.imp_uid;
                msg += '\n상점 거래ID : ' + rsp.merchant_uid;
                msg += '\n결제 금액 : ' + rsp.paid_amount;
                msg += '\n카드 승인번호 : ' + rsp.apply_num;
    
                alert(msg);*/
                location.href="/recepit?condition=success&id="+rsp.imp_uid+"&uid="+rsp.merchant_uid+"&total="+rsp.paid_amount+"&card="+rsp.apply_num;
    
            }).fail(function(data) {
                console.log(data);
            //}).always(function(data) {
            //	console.log(data);
            });
        } else {
           
            location.href="/recepit?condition=fail&err="+rsp.error_msg;
        }
    
        //location.href = 'payResult.asp';
    });
}
