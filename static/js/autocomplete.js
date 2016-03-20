

$(document).ready(function() {
  var src = [
    {label: "risk reduction", value: "riskreduction"},
    {label: "primary prevention", value: "primaryprevention"},
    {label: "faculty-staff training",value: "facultystafftraining"},
    {label: "title IX office",value: "titleixoffice"},
    {label: "volunteer group",value: "volunteergroup"},
    {label: "student initiative",value: "studentinitiative"},
    {label: "mens group",value: "mensgroup"},
    {label: "other offices",value: "otheroffices"},
    {label: "stats on campus reports",value: "oncampusreports"},
    {label: "stats on all reports",value: "allreports"},
    {label: "stats on climate studies",value: "climatestudy"},
    {label: "consent",value: "consent"},
    {label: "sexual assault",value: "sexualassault"},
    {label: "sexual harassment",value: "sexualharassment"},
    {label: "stalking",value: "stalking"},
    {label: "dating violence",value: "datingviolence"},
    {label: "domestic violence",value: "domesticviolence"},
    {label: "awareness about policies",value: "aboutpolicies"},
    {label: "awareness about reporting",value: "aboutreporting"}
  ];
  var tags = [ "risk reduction", "primary prevention", "faculty-staff training", "title IX office",
  "volunteer group", "student initiative", "mens group", "other offices", "stats on campus reports",
  "stats on all reports", "stats on climate studies", "consent", "sexual assault", "sexual harassment",
  "stalking", "dating violence", "domestic violence", "awareness about policies", "awareness about reporting"]
  
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