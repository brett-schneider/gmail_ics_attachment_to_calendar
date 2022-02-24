var label = '<label>';
var calid = '<id@group.calendar.google.com>';

function getSportMails() {
  var threads = GmailApp.search("label:{label} is:unread");
  var cal = CalendarApp.getCalendarById(calid);
  
  // Only get events for unread messages in the GMAIL_LABEL
  for (var i = 0; i < threads.length; i++) {
    threads[i].getMessages().forEach(m => m.getAttachments().forEach(a => addICStoCal(a.getDataAsString(),cal)));
    threads[i].markRead();
  }
}

function addICStoCal(form,cal) {
  var evnts = form.split(/:VEVENT/m).filter(function (value, index, ar) { return (index % 2 == 1); } );
  Logger.log(['Events found: ', evnts.length, evnts]);
  evnts.forEach(e => {
    esta = e.match(/DTSTART[^:]*:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/).slice(1).map(v => parseInt(v));
    eend = e.match(/DTEND[^:]*:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/).slice(1).map(v => parseInt(v));
    esum = e.match(/^SUMMARY:(.*)$/m).slice(1)[0];
    euid = e.match(/^(UID:.*)$/m);
    Logger.log(euid);
    // javascripy is shit with months
    if (esta[1]) esta[1]--;
    if (eend[1]) eend[1]--;
    // Logger.log([esum,esta,new Date(...esta),eend,new Date(...eend)]);
    sdt = new Date(...esta);
    edt = new Date(...eend);
    if (cal.getEvents(sdt, edt, { search: esum }).length == 0) {
      let nev = cal.createEvent(esum, sdt, edt);
      Logger.log('Created');
    } else {
      Logger.log('Duplicate');
    }
  });
}
