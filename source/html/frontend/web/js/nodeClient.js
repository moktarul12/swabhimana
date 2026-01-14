/*********************************
 * SOCKET CONNECTION
 *********************************/

// HTTPS
var socket = io('http://134.209.154.65:8081', {
    transports: ['websocket']
});

// HTTP (optional)
// var socket = io('http://airfinchscript.com:8085', {
//     transports: ['websocket']
// });

/*********************************
 * JOIN ROOM (REQUIRED)
 *********************************/
socket.emit('join', {
    joinId: $('#inquiryid').val()
});

var typingTrack = 0;
var timerId;

/*********************************
 * TYPING EVENT
 *********************************/
$(document).on('keypress', '#contactmessage', function (e) {

    var keycode = e.keyCode;
    var message = $('#contactmessage').val();
    var messageLength = message.length;

    if (typingTrack === 0 && keycode !== 13 && messageLength < 500) {

        socket.emit('messageTyping', {
            senderId: $('#userid').val(),
            receiverId: $('#hostid').val(),
            listingId: $('#listingid').val(),
            inquiryId: $('#inquiryid').val(),
            message: "type"
        });

        typingTrack = 1;
    }

    if (keycode === 13) {
        sendMessage();
        return false;
    }

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(function () {

        typingTrack = 0;

        socket.emit('messageTyping', {
            senderId: $('#userid').val(),
            receiverId: $('#hostid').val(),
            listingId: $('#listingid').val(),
            inquiryId: $('#inquiryid').val(),
            message: "untype"
        });

    }, 1000);
});

/*********************************
 * SEND BUTTON
 *********************************/
$(document).on('click', '.sendbtn', function () {
    sendMessage();
    return false;
});

/*********************************
 * RECEIVE MESSAGE
 *********************************/
socket.on('message', function (data) {

    var receiverid = $("#userid").val();

    if (receiverid == $.trim(data.receiver)) {

        $.ajax({
            url: baseurl + '/user/messages/updatemessage',
            type: "POST",
            data: {
                senderid: data.sender,
                receiverid: data.receiver,
                listingid: data.listing,
                inquiryid: data.inquiry,
                message: data.message
            },
            success: function (datas) {

                if (datas !== "failed") {
                    datas = JSON.parse(datas);
                    var newMsgContent = constructData('right', datas, 'message');
                    var appendlabel = ".msgbox-" + data.listing + "-" + data.receiver + "-" + data.sender;
                    $(appendlabel).prepend(newMsgContent);
                }
            }
        });
    }
});

/*********************************
 * TYPING INDICATOR
 *********************************/
socket.on('messageTyping', function (data) {

    var accessId = ".live-messages-typing-" +
        data.listing + "-" +
        data.receiver + "-" +
        data.sender;

    if (data.message === "untype")
        $(accessId).css('opacity', "0");
    else
        $(accessId).css('opacity', "1");
});

/*********************************
 * MESSAGE UI
 *********************************/
function constructData(align, data) {

    var outputData = '';

    if (align === 'left') {
        outputData =
            '<div class="claimleft">' +
            '<div class="airfcfx-claimleftimgdiv claimleftimgdiv">' +
            '<span class="airfcfx-user-icon profile_pict inlinedisplay" style="background-image:url(' + data.userImg + ');"></span>' +
            '</div>' +
            '<div class="airfcfx-claimrighttextdiv claimrighttextdiv">' +
            '<span class="airfcfx-left-chat-arrow"></span>' +
            '<a href="' + data.profileURL + '">' + data.userName + '</a>' +
            '<span class="airfcfx-message-date padleft">' + data.date + '</span><br/>' +
            '<span class="mobmsgalgn">' + data.newMessage + '</span>' +
            '</div></div><div class="clear"></div>';
    }

    if (align === 'right') {
        outputData =
            '<div class="claimright"><div class="claimdiv">' +
            '<div class="airfcfx-claimrightimgdiv claimrightimgdiv">' +
            '<span class="airfcfx-user-icon profile_pict inlinedisplay" style="background-image:url(' + data.userImg + ');"></span>' +
            '</div>' +
            '<div class="airfcfx-claimlefttextdiv claimlefttextdiv">' +
            '<span class="airfcfx-right-chat-arrow"></span>' +
            '<span class="airfcfx-message-date padright">' + data.date + '</span>' +
            '<a href="' + data.profileURL + '">' + data.userName + '</a><br />' +
            '<span class="mobmsgalgn">' + data.newMessage + '</span>' +
            '</div></div></div><div class="clear"></div>';
    }

    return outputData;
}

/*********************************
 * SEND MESSAGE
 *********************************/
function sendMessage() {

    var senderid = $("#userid").val();
    var receiverid = $("#hostid").val();
    var messages = $("#contactmessage").val();
    var listingid = $("#listingid").val();
    var inquiryid = $('#inquiryid').val();

    if ($.trim(messages) === "") {
        $(".msgerrcls").show().html("Enter Contact Message");
        return false;
    }

    if (messages.length > 500) {
        $(".msgerrcls").show().html("Message should have maximum of 500 characters");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: baseurl + '/user/messages/sendmessage',
        data: {
            senderid: senderid,
            receiverid: receiverid,
            messages: messages,
            listingid: listingid,
            inquiryid: inquiryid
        },
        beforeSend: function () {
            $("#loadingimg").show();
        },
        success: function (data) {

            if ($.trim(data) === "0") {
                $(".msgerrcls").show().html("Message not send, Try again.");
                return;
            }

            data = JSON.parse(data);

            socket.emit('message', {
                receiverId: receiverid,
                senderId: senderid,
                listingId: listingid,
                message: data.newMessage,
                inquiryId: inquiryid
            });

            var appendData = constructData('left', data);
            var appendlabel = ".msgbox-" + listingid + "-" + senderid + "-" + receiverid;
            $(appendlabel).prepend(appendData);

            $("#loadingimg").hide();
            $("#contactmessage").val("");
        }
    });
}
