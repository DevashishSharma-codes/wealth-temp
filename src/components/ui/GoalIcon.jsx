import React from 'react';

const iconStyle = {
  width: "20px",
  height: "20px",
  minWidth: "20px",
  minHeight: "20px",
  color: "#2459D2",
  flexShrink: 0,
  display: "block"
};

export function GoalIcon({ type }) {

const renderIcon=(path)=>(
<svg
style={iconStyle}
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
viewBox="0 0 24 24"
>
{path}
</svg>
);

switch(type){

case "Home Purchase":
return renderIcon(
<>
<path d="M3 12L12 4L21 12"/>
<path d="M5 10V20H19V10"/>
</>
);

case "Car Purchase":
return renderIcon(
<>
<path d="M5 16V11L7 7H17L19 11V16"/>
<circle cx="8" cy="16" r="1.5"/>
<circle cx="16" cy="16" r="1.5"/>
</>
);

case "Home Renovation":
return renderIcon(
<>
<path d="M12 3L20 18H4L12 3"/>
<path d="M12 9V13"/>
<circle cx="12" cy="17" r="1"/>
</>
);

case "Holiday Home":
return renderIcon(
<>
<path d="M12 3C8 3 5 6 5 10C5 15 12 21 12 21"/>
<circle cx="12" cy="10" r="2"/>
</>
);

case "Foreign Tour":
return renderIcon(
<>
<circle cx="12" cy="12" r="8"/>
<path d="M4 12H20"/>
<path d="M12 4C15 7 15 17 12 20"/>
<path d="M12 4C9 7 9 17 12 20"/>
</>
);

case "Family Gifting":
return renderIcon(
<>
<path d="M4 10H20V20H4Z"/>
<path d="M12 10V20"/>
<path d="M4 14H20"/>
</>
);

case "Charity":
return renderIcon(
<>
<path d="M12 20L5 13C3 11 3 7 6 6C8 5 10 6 12 8C14 6 16 5 18 6C21 7 21 11 19 13Z"/>
</>
);

case "Child Birth Expenses":
return renderIcon(
<>
<circle cx="12" cy="12" r="8"/>
<circle cx="12" cy="12" r="2"/>
</>
);

case "Big Purchases":
return renderIcon(
<>
<path d="M7 8H17L19 20H5Z"/>
<path d="M9 8V6A3 3 0 0115 6V8"/>
</>
);

case "Estate For Children":
return renderIcon(
<>
<path d="M7 3H14L19 8V21H7Z"/>
<path d="M14 3V8H19"/>
</>
);

case "Other":
case "Others":
case "Custom Goal":
return renderIcon(
<>
<circle cx="12" cy="12" r="9"/>
<circle cx="12" cy="12" r="5"/>
<circle cx="12" cy="12" r="1.5"/>
</>
);

default:
return renderIcon(
<>
<circle cx="12" cy="12" r="9"/>
<path d="M12 8V12"/>
<circle cx="12" cy="16" r="1"/>
</>
);
}
}