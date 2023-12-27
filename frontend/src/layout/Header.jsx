import { useSelector } from 'react-redux'

export default function Header() {
    const data = useSelector((state) => state.store.info)
    return (
        <>
            <div className='text-end p-3' style={{ backgroundColor: '#105c77', color: 'white' }}>
                {data.name}
            </div >
        </>
    );
}
