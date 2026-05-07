const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const before = content.length;

// 1. Remove CampusManager function (entire block)
content = content.replace(
  /\nfunction CampusManager\(\{campuses,setCampuses\}:any\)\{[\s\S]*?\n\}\n\nfunction BackupRestore/,
  '\nfunction BackupRestore'
);

// 2. Remove ICAMPUSES constant
content = content.replace(/\nconst ICAMPUSES=\[\{id:"campus_main",name:"Central HQ Campus"\}\];/, '');

// 3. Remove role_campus_admin from IROLES (keep the closing bracket)
// It's the last item before ];
content = content.replace(
  /\n  \{id:"role_campus_admin",name:"Campus Admin",description:"Manages a specific campus — sees only their campus data",color:"#0891b2",isSystem:false\},\n\];/,
  '\n];'
);

// 4. Remove campuses=[] and setCampuses=()=>{} from ChurchSettingsPage params
content = content.replace(
  /,campuses=\[\],setCampuses=\(\)=>\{\}\}:any\)\{(\s*const \[form)/,
  '}:any){$1'
);

// 5. Remove campuses tab from ChurchSettingsPage tab bar
content = content.replace(
  /\{id:'campuses',label:'[^']*Campuses'\},/,
  ''
);

// 6. Remove CampusManager render in ChurchSettingsPage
content = content.replace(
  /\s*\{stab==='campuses'&&<CampusManager campuses=\{campuses\} setCampuses=\{setCampuses\}\/>\}/,
  ''
);

// 7. Remove campuses and activeCampusId params from People
content = content.replace(
  /,campuses=\[\],activeCampusId='all'\}:any\) \{(\s*const \[tab)/,
  '}:any) {$1'
);

// 8. Remove campusAssignOpen and campusAssignVal state from People
content = content.replace(
  /\n  const \[campusAssignOpen,setCampusAssignOpen\] = useState\(false\);\n  const \[campusAssignVal,setCampusAssignVal\] = useState\(""\);/,
  ''
);

// 9. Remove campus filter in applyFilters
content = content.replace(
  /\s*if\(activeCampusId && activeCampusId!=='all'\) \{\n\s*if\(\(p\.campus\|\|'campus_main'\)!==activeCampusId\) return false;\n\s*\}/,
  ''
);

// 10. Remove bulk campus assign button in People toolbar
content = content.replace(
  /\n\s*\{campuses\.length>1&&<Btn v="ghost" style=\{\{fontSize:11,padding:"5px 10px"\}\} onClick=\{\(\)=>\{setCampusAssignVal\(campuses\[0\]\.id\);setCampusAssignOpen\(true\);\}\}>🏛 Campus<\/Btn>\}/,
  ''
);

// 11. Remove Assign Campus Modal block in People
content = content.replace(
  /\n\s*\{\/\* ── Assign Campus Modal ──[^}]*──── \*\/\}\n\s*<Modal open=\{campusAssignOpen\}[\s\S]*?<\/Modal>\n/,
  '\n'
);

// 12. Remove campus field in edit form (People detail view)
content = content.replace(
  /\n\s*\{campuses\.length>1&&<Fld label="Campus"><select value=\{editForm\.campus[^}]*\}[^<]*<\/select><\/Fld>\}/,
  ''
);

// 13. Remove activeCampusId and campuses params from Attendance
content = content.replace(
  /function Attendance\(\{attendance,setAttendance,setView,activeCampusId='all',campuses=\[\]\}:any\)/,
  'function Attendance({attendance,setAttendance,setView}:any)'
);

// 14. Remove campus from new attendance record in Attendance.save
content = content.replace(
  /setAttendance\(\[\{\.\.\.form,count:\+form\.count,members:\+form\.members\|\|0,visitors:\+form\.visitors\|\|0,campus:activeCampusId&&activeCampusId!=='all'\?activeCampusId:'campus_main',/,
  'setAttendance([{...form,count:+form.count,members:+form.members||0,visitors:+form.visitors||0,'
);

// 15. Remove filtAtt filter and replace uses of filtAtt with attendance
content = content.replace(
  /\n  const filtAtt = activeCampusId&&activeCampusId!=='all' \? attendance\.filter\(\(a:any\)=>\(a\.campus\|\|'campus_main'\)===activeCampusId\) : attendance;/,
  ''
);
content = content.replace(/\bfiltAtt\b/g, 'attendance');

// 16. Remove activeCampusId and campuses params from Giving
content = content.replace(
  /function Giving\(\{giving,setGiving,pledgeDrives,setPledgeDrives,pledges,setPledges,members,visitors,weeklyReports,setWeeklyReports,emailTemplates,currentUser=null,roles=\[\],activeCampusId='all',campuses=\[\]\}:any\)/,
  'function Giving({giving,setGiving,pledgeDrives,setPledgeDrives,pledges,setPledges,members,visitors,weeklyReports,setWeeklyReports,emailTemplates,currentUser=null,roles=[]}:any)'
);

// 17. Remove filtGiving filter and replace uses of filtGiving with giving
content = content.replace(
  /\n  const filtGiving = activeCampusId&&activeCampusId!=='all' \? giving\.filter\(\(g:any\)=>\(g\.campus\|\|'campus_main'\)===activeCampusId\) : giving;/,
  ''
);
content = content.replace(/\bfiltGiving\b/g, 'giving');

// 18. Remove campus from new giving record in Giving.save
content = content.replace(
  /setGiving\(\[\{\.\.\.form,amount:\+form\.amount,campus:activeCampusId&&activeCampusId!=='all'\?activeCampusId:'campus_main',/,
  'setGiving([{...form,amount:+form.amount,'
);

// 19. Remove campuses param from AddMemberPage
content = content.replace(
  /function AddMemberPage\(\{members,setMembers,visitors,setVisitors,currentUser,roles,permissions,setView,prospects,setProspects,children=\[\],setChildren=null,campuses=\[\]\}:any\)/,
  'function AddMemberPage({members,setMembers,visitors,setVisitors,currentUser,roles,permissions,setView,prospects,setProspects,children=[],setChildren=null}:any)'
);

// 20. Remove campus field from blankForm in AddMemberPage
content = content.replace(
  /\n    \/\/ Campus\n    campus:campuses\.length>0\?campuses\[0\]\.id:"campus_main",/,
  ''
);

// 21. Remove campus dropdown in AddMemberPage UI
content = content.replace(
  /\n\s*\{campuses\.length>1&&\(\n\s*<Fld label="Campus">\n\s*<select value=\{form\.campus\}[\s\S]*?<\/Fld>\n\s*\)\}/,
  ''
);

// 22. Remove campuses/activeCampusId state declarations and their useEffects
content = content.replace(
  /\n  const \[campuses,setCampuses\] = useState\(\(\)=>lsGet\('campuses'\)\?\?ICAMPUSES\);\n  const \[activeCampusId,setActiveCampusId\] = useState\(\(\)=>lsGet\('activeCampusId'\)\?\?'all'\);\n  useEffect\(\(\)=>\{lsSave\('campuses',campuses\);\},\[JSON\.stringify\(campuses\)\]\);\n  useEffect\(\(\)=>\{lsSave\('activeCampusId',activeCampusId\);\},\[activeCampusId\]\);/,
  ''
);

// 23. Remove campuses from data load
content = content.replace(
  /\n\s*if\(Array\.isArray\(d\.campuses\)&&d\.campuses\.length\) setCampuses\(d\.campuses\);/,
  ''
);

// 24. Remove campuses from both save blobs
content = content.replace(
  /,campuses\};\n(\s*const \{error\})/,
  '};\n$1'
);
content = content.replace(
  /,campuses\}\)\]\);/,
  '}]);'
);

// 25. Remove campus selector from navbar (the whole block including blank line)
// The comment has a broken emoji, so match by the surrounding reliable text
content = content.replace(
  /\n\s*\{\/\*[^*]*Campus Selector[^*]*\*\/\}\n\s*\{!isStaff && campuses\.length>1 && \(\n\s*<select value=\{activeCampusId\}[\s\S]*?\}\)\}\n/,
  '\n'
);

// 26. Remove campuses and setCampuses props from ChurchSettingsPage call
content = content.replace(
  / campuses=\{campuses\} setCampuses=\{setCampuses\}\n/,
  '\n'
);

// 27. Remove campuses prop from AddMemberPage call
content = content.replace(
  / campuses=\{campuses\}\/>/,
  '/>'
);

// 28. Remove campuses and activeCampusId props from People call
content = content.replace(
  / campuses=\{campuses\} activeCampusId=\{activeCampusId\}\/>/,
  '/>'
);

// 29. Remove activeCampusId and campuses props from Attendance call
content = content.replace(
  / activeCampusId=\{activeCampusId\} campuses=\{campuses\}\/>/,
  '/>'
);

// 30. Remove activeCampusId and campuses props from Giving call
content = content.replace(
  / activeCampusId=\{activeCampusId\} campuses=\{campuses\}\/>/,
  '/>'
);

const after = content.length;
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Done. File size: ${before} -> ${after} bytes (removed ${before - after} bytes)`);

// Verify no campus references remain (except in data fields we intentionally kept)
const remaining = (content.match(/\bcampus\b/gi) || []).length;
console.log(`Remaining 'campus' references: ${remaining}`);
