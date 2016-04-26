var RPB_Preview_Template = 
`<?xml version="1.0" encoding="UTF-8" ?>
<document>
  <stackTemplate>
    <collectionList>

    	<% _.each(cameras, function(camera, index) { %>

    	<shelf>
    		<header>
    			<title><%=camera.name%></title>
    		</header>
            <section index="<%=index%>">

            	<%=createRPBPreviewSection(camera).documentElement.innerHTML%>
            	
            </section>
        </shelf>

  		<% }); %>

    </collectionList>
  </stackTemplate>
</document>`;

var RPB_Preview_Section_Template =
`<?xml version="1.0" encoding="UTF-8" ?>
<document>

	<% if (camera.status == 1) { %>

	<% if (camera.eventCollection.length > 0) { %>

	<% _.each(camera.eventCollection[0].events, function(event) { %>

	<lockup type="video">
		<img src="" width="390" height="220"/>
	  	<title><%=event.start_time%></title>
	</lockup>

	<% }); %>

	<% } %>

	<lockup type="more">
		<img src="" width="390" height="220"/>
	  	<title>More</title>
	</lockup>

	<% } else if (camera.status == 0) { %>

	<lockup type="loading">
		<img src="" width="390" height="220"/>
	  	<title>Loading...</title>
	</lockup>	

	<% } else if (camera.status == -1) { %>

	<lockup type="unknown">
		<img src="" width="390" height="220"/>
	  	<title>Unknown</title>
	</lockup>	

	<% } %>

</document>`;

var RPB_Date_Preview_Template =
`<?xml version="1.0" encoding="UTF-8" ?>
<document camera_id="<%=camera_id%>">
	<stackTemplate>
		<banner>
			<title></title>
		</banner>
		<collectionList>
			<grid>
				<section>

					<%=createRPBDatePreviewItem(date, camera).documentElement.innerHTML%>

					<lockup type="more" date="<%=timeintervalsince1970(getDayFromDate(date, -10))%>">
						<img src="" width="308" height="174"/>
					  	<title>More</title>
					</lockup>
					
				</section>
			</grid>
		</collectionList>
	</stackTemplate>
</document>`;

var RPB_Date_Preivew_Days_Template = 
`<?xml version="1.0" encoding="UTF-8" ?>
<document>

	<% _.each(dates, function(date) { %>

	<% var dateItem = findDateItemFromCollection(date, camera); %>

	<% if (dateItem != null) { %>

	<lockup type="date" date="<%=timeintervalsince1970(date)%>">
		<img src="" width="308" height="174"/>
	  	<title>Loaded</title>
	</lockup>

	<% } else { %>

	<lockup type="loading" date="<%=timeintervalsince1970(date)%>">
		<img src="" width="308" height="174"/>
	  	<title>Loading...</title>
	</lockup>

	<% } %>

	<% }); %>

</document>`;

var createRPBPreview = function(cameras) {

    var template = _.template(RPB_Preview_Template);

    var parser = new DOMParser();

    var doc = parser.parseFromString(template(cameras), "application/xml");

    return doc;
}

var createRPBPreviewSection = function(camera) {

	var template = _.template(RPB_Preview_Section_Template);

    var parser = new DOMParser();

    var doc = parser.parseFromString(template({ camera: camera }), "application/xml");

    return doc;

}

var createRPBDatePreivew = function(camera_id, camera) {

	var template = _.template(RPB_Date_Preview_Template);

    var parser = new DOMParser();

    var today = new Date();

    today.setHours(0, 0, 0, 0);

    var doc = parser.parseFromString(template({ camera_id: camera_id, date: today, camera: camera }), "application/xml");

    return doc;

}

var createRPBDatePreviewItem = function(date, camera) {

	var template = _.template(RPB_Date_Preivew_Days_Template);

    var parser = new DOMParser();

    var doc = parser.parseFromString(template({ dates: get10DaysFromDate(date), camera: camera }), "application/xml");

    return doc;

}

var findDateItemFromCollection = function(date, camera) {
	
	var result = null;

	for (var i = 0; i < camera.eventCollection.length; i++) {

		if (camera.eventCollection[i].date.getTime() == date.getTime()) {

			result = camera.eventCollection[i];

			break;

		}

	}

	return result;

}

var get10DaysFromDate = function(date) {
	
	var dates = [];

    for (var i = 0; i < 10; i++) {

    	dates.push(getDayFromDate(date, i * -1));

    }

    return dates;

}

var getDayFromDate = function(date, offset) {
	
	var new_date = new Date()

	new_date.setDate(date.getDate() + offset);

	new_date.setHours(0, 0, 0, 0);

	return new_date;

}

var timeintervalsince1970 = function(date) {
	
	return parseInt(date.getTime() / 1000);

}



