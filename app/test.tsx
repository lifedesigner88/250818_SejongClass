
export default function Test() {
    return <div className={"flex flex-col items-center justify-center h-full bg-blue-100"} id={"test"}>

        <div className={"w-100 h-100 bg-red-50 overflow-auto "}>
            <div className="flex">
                <div className="w-20 bg-red-500">고정</div>
                <div className="flex-1 bg-blue-500">남은 공간 모두 차지</div>
                <div className="w-20 bg-green-500">고정</div>
            </div>
        </div>

    </div>;
}
