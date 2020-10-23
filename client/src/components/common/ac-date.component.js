import { format } from 'date-fns';

const AcDate = props => {

    const formatDate = () => {
        return format(new Date(props.date), 'dd/MM/yy');
    }

    return formatDate();
}

export default AcDate;