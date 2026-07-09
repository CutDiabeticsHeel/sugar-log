import SugarForm from "../components/sugar-form";
import SugarLogDay from "../components/sugar-log-day";
import CalendarFrom from "../components/calendar-form";

function Diary() {
    return (
        <div>
            <h1>Дневник</h1>
            <CalendarFrom />
            <SugarForm/>
            <SugarLogDay/>
            <SugarLogDay/>
            <SugarLogDay/>
            <SugarLogDay/>
            <SugarLogDay/>
            <SugarLogDay/>
            <SugarLogDay/>
        </div>
    )
}

export default Diary;