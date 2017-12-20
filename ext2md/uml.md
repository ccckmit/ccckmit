# UML

## Sequence 1

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0AHans%20-%3E%20John%20%3A%20Hallo%0D%0AJohn%20-%3E%20Carla%20%3A%20Hi%0D%0ACarla%20-%3E%20Hans%20%3A%20Ola%0D%0A%40enduml"/>

## Sequence 2

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0AAlice%20-%3E%20Bob%3A%20Authentication%20Request%0D%0ABob%20--%3E%20Alice%3A%20Authentication%20Response%0D%0A%0D%0AAlice%20-%3E%20Bob%3A%20Another%20authentication%20Request%0D%0AAlice%20%3C--%20Bob%3A%20another%20authentication%20Response%0D%0A%40enduml"/>

## Use Case 1

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0A%3AMain%20Admin%3A%20as%20Admin%0D%0A(Use%20the%20application)%20as%20(Use)%0D%0A%0D%0AUser%20-%3E%20(Start)%0D%0AUser%20--%3E%20(Use)%0D%0A%0D%0AAdmin%20---%3E%20(Use)%0D%0A%0D%0Anote%20right%20of%20Admin%20%3A%20This%20is%20an%20example.%0D%0A%0D%0Anote%20right%20of%20(Use)%0D%0A%20%20A%20note%20can%20also%0D%0A%20%20be%20on%20several%20lines%0D%0Aend%20note%0D%0A%0D%0Anote%20%22This%20note%20is%20connected%5Cnto%20several%20objects.%22%20as%20N2%0D%0A(Start)%20..%20N2%0D%0AN2%20..%20(Use)%0D%0A%40enduml"/>

## Activity Diagram

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0A%0D%0Astart%0D%0A%0D%0Aif%20(multiprocessor%3F)%20then%20(yes)%0D%0A%20%20fork%0D%0A%20%20%20%20%3ATreatment%201%3B%0D%0A%20%20fork%20again%0D%0A%20%20%20%20%3ATreatment%202%3B%0D%0A%20%20end%20fork%0D%0Aelse%20(monoproc)%0D%0A%20%20%3ATreatment%201%3B%0D%0A%20%20%3ATreatment%202%3B%0D%0Aendif%0D%0A%0D%0A%40enduml"/>

## State Diagram

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0A%0D%0A%5B*%5D%20--%3E%20NotShooting%0D%0A%0D%0Astate%20%22Not%20Shooting%20State%22%20as%20NotShooting%20%7B%0D%0A%20%20state%20%22Idle%20mode%22%20as%20Idle%0D%0A%20%20state%20%22Configuring%20mode%22%20as%20Configuring%0D%0A%20%20%5B*%5D%20--%3E%20Idle%0D%0A%20%20Idle%20--%3E%20Configuring%20%3A%20EvConfig%0D%0A%20%20Configuring%20--%3E%20Idle%20%3A%20EvConfig%0D%0A%7D%0D%0A%0D%0Anote%20right%20of%20NotShooting%20%3A%20This%20is%20a%20note%20on%20a%20composite%20state%0D%0A%0D%0A%40enduml"/>

## Gantt Chart

<img src="http://plantuml.rado0x54.com/png?uml=%40startgantt%0D%0A%5BPrototype%20design%5D%20lasts%2013%20days%0D%0A%5BTest%20prototype%5D%20lasts%204%20days%0D%0A%5BTest%20prototype%5D%20starts%20at%20%5BPrototype%20design%5D's%20end%0D%0A%5BPrototype%20design%5D%20is%20colored%20in%20Fuchsia%2FFireBrick%20%0D%0A%5BTest%20prototype%5D%20is%20colored%20in%20GreenYellow%2FGreen%20%0D%0A%40endgantt"/>

## Timing Diagram

<img src="http://plantuml.rado0x54.com/png?uml=%40startuml%0D%0Arobust%20%22DNS%20Resolver%22%20as%20DNS%0D%0Arobust%20%22Web%20Browser%22%20as%20WB%0D%0Aconcise%20%22Web%20User%22%20as%20WU%0D%0A%0D%0A%400%0D%0AWU%20is%20Idle%0D%0AWB%20is%20Idle%0D%0ADNS%20is%20Idle%0D%0A%0D%0A%40%2B100%0D%0AWU%20-%3E%20WB%20%3A%20URL%0D%0AWU%20is%20Waiting%0D%0AWB%20is%20Processing%0D%0A%0D%0A%40%2B200%0D%0AWB%20is%20Waiting%0D%0AWB%20-%3E%20DNS%40%2B50%20%3A%20Resolve%20URL%0D%0A%0D%0A%40%2B100%0D%0ADNS%20is%20Processing%0D%0A%0D%0A%40%2B300%0D%0ADNS%20is%20Idle%0D%0A%40enduml"/>

## Salt UI

<img src="http://plantuml.rado0x54.com/png?uml=%40startsalt%0D%0A%7B%2B%0D%0A%7B%2F%20%3Cb%3EGeneral%20%7C%20Fullscreen%20%7C%20Behavior%20%7C%20Saving%20%7D%0D%0A%7B%0D%0A%09%7B%20Open%20image%20in%3A%20%7C%20%5ESmart%20Mode%5E%20%7D%0D%0A%09%5BX%5D%20Smooth%20images%20when%20zoomed%0D%0A%09%5BX%5D%20Confirm%20image%20deletion%0D%0A%09%5B%20%5D%20Show%20hidden%20images%0D%0A%7D%0D%0A%5BClose%5D%0D%0A%7D%0D%0A%40endsalt"/>

## Ditaa

<img src="http://plantuml.rado0x54.com/png?uml=%40startditaa%0D%0A%2B--------%2B%20%20%20%2B-------%2B%20%20%20%20%2B-------%2B%0D%0A%7C%20%20%20%20%20%20%20%20%2B---%2B%20ditaa%20%2B--%3E%20%7C%20%20%20%20%20%20%20%7C%0D%0A%7C%20%20Text%20%20%7C%20%20%20%2B-------%2B%20%20%20%20%7Cdiagram%7C%0D%0A%7CDocument%7C%20%20%20%7C!magic!%7C%20%20%20%20%7C%20%20%20%20%20%20%20%7C%0D%0A%7C%20%20%20%20%20%7Bd%7D%7C%20%20%20%7C%20%20%20%20%20%20%20%7C%20%20%20%20%7C%20%20%20%20%20%20%20%7C%0D%0A%2B---%2B----%2B%20%20%20%2B-------%2B%20%20%20%20%2B-------%2B%0D%0A%09%3A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5E%0D%0A%09%7C%20%20%20%20%20%20%20Lots%20of%20work%20%20%20%20%20%20%7C%0D%0A%09%2B-------------------------%2B%0D%0A%40endditaa"/>

## DOT

<img src="http://plantuml.rado0x54.com/png?uml=%40startdot%0D%0Adigraph%20foo%20%7B%0D%0A%20%20node%20%5Bstyle%3Drounded%5D%0D%0A%20%20node1%20%5Bshape%3Dbox%5D%0D%0A%20%20node2%20%5Bfillcolor%3Dyellow%2C%20style%3D%22rounded%2Cfilled%22%2C%20shape%3Ddiamond%5D%0D%0A%20%20node3%20%5Bshape%3Drecord%2C%20label%3D%22%7B%20a%20%7C%20b%20%7C%20c%20%7D%22%5D%0D%0A%0D%0A%20%20node1%20-%3E%20node2%20-%3E%20node3%0D%0A%7D%0D%0A%40enddot"/>

