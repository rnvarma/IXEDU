

$(document).ready(function() {
  var src = [
    {label: "risk reduction", value: "riskreduction"},
    {label: "secondary prevention", value: "riskreduction"},
    {label: "risk", value: "riskreduction"}, 
    {label: "primary prevention", value: "primaryprevention"},
    {label: "faculty-staff training",value: "facultystafftraining"},
    {label: "faculty staff training", value: "facultystafftraining"},
    {label: "title IX office",value: "titleixoffice"},
    {label: "titleIX office", value: "titleixoffice"},
    {label: "title ix office",value: "titleixoffice"},
    {label: "titleix office", value: "titleixoffice}"},
    {label: "volunteer group",value: "volunteergroup"},
    {label: "volunteer", value: "volunteergroup"},
    {label: "student initiative",value: "studentinitiative"},
    {label: "mens group",value: "mensgroup"},
    {label: "other offices",value: "otheroffices"},
    {label: "stats on campus reports",value: "oncampusreports"},
    {label: "campus reports", value: "oncampusreports"},
    {label: "stats on all reports",value: "allreports"},
    {label: "all reports", value: "allreports"},
    {label: "stats on climate studies",value: "climatestudy"},
    {label: "climate study", value: "climatestudy"},
    {label: "consent",value: "consent"},
    {label: "sexual assault",value: "sexualassault"},
    {label: "sexual harassment",value: "sexualharassment"},
    {label: "stalking",value: "stalking"},
    {label: "dating violence",value: "datingviolence"},
    {label: "domestic violence",value: "domesticviolence"},
    {label: "awareness about policies",value: "aboutpolicies"},
    {label: "policies", value: "aboutpolicies"},
    {label: "awareness about reporting",value: "aboutreporting"},
    {label: "reporting", value: "aboutreporting"}
  ];
  var tags = [ "risk reduction", "secondary prevention", "risk", "primary prevention", "faculty-staff training", 
  "faculty staff training", "faculty staff training", "title IX office", "titleIX office", "title ix office", "titleix office",
  "volunteer group", "volunteer", "student initiative", "mens group", "other offices", "stats on campus reports", 
  "campus reports", "stats on all reports", "all reports", "stats on climate studies", "climate study", "consent", 
  "sexual assault", "sexual harassment", "stalking", "dating violence", "domestic violence", "awareness about policies", "policies", 
  "awareness about reporting", "reporting" ]
  
  $("#search-area").tagit({
    availableTags: tags,
  });


  $(".search-btn").click(function() {
    qs = []
    $("#search-area > li").each(function() {
      qs.push($(this).text())
    })
    qs.pop()
    var stuff = []
    for (var i = 0; i < qs.length; i++) {
      var word = qs[i]
      stuff.push(word.slice(0, word.length-1))
    }
    window.location.href = "/search?q=" + stuff.join()
  })
})