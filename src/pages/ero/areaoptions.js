var list = [];
for (var i = 2019; i >= 1900; i--) {
  list.push({ value: i, label: i });
}

var oneToTen = [];
for (var j = 1; j <= 10; j++) {
  oneToTen.push({ value: j, label: j });
}

const AreaOptions = {
  // selectedRegisteredPatient: [
  //   {
  //     value:
  //       "Username: charlie : full name (charlie chaplin) Day of Birth: 1970-12-21male",
  //     label:
  //       "Username: charlie : full name (charlie chaplin) Day of Birth: 1970-12-21male",
  //   },
  // ],
  Floor: [
    {value: "Floor001", label: "Floor 1" },
    {value: "Floor002", label: "Floor 2" },
    {value: "Floor003", label: "Floor 3" },
    {value: "Floor004", label: "Floor 4" },
    {value: "Floor005", label: "Floor 5" },
    {value: "Floor006", label: "Floor 6" },
    {value: "Floor-001", label: "Floor -1" },	
    {value: "Floor-002", label: "Floor -2" },		
    {value: "Floor-003", label: "Floor -3" },			
    {value: "Floor-004", label: "Floor -4" },				
  ],
  Name: [
    {value: "cantine", label: "kantine" },
    {value: "lobby", label: "lobby" },
    {value: "WC", label: "WC" },
    {value: "officeCS", label: "office CS" },
    {value: "officeDouane", label: "office Douane" },
    {value: "reception", label: "reception" },
    {value: "gaswaterelec", label: "Gas Water Electricity" },
    {value: "elevator", label: "elevator" },
    {value: "stairs", label: "stairs" },
    {value: "sprinklersystem", label: "skrinker-pomp" },
    {value: "watersilo", label: "watersilo" },
    {value: "accuspace", label: "accu-space" },	
    {value: "smokingarea", label: "Smoking Area" },		
    {value: "entrance", label: "Entrance" },			
    {value: "meetingpoint", label: "Meetingpoint" },				
    {value: "AED", label: "AED" },					
    {value: "reception", label: "reception" },						
};

export default AreaOptions;