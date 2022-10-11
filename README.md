
# Trello

<img src ="https://user-images.githubusercontent.com/96935557/195057656-8ab81f72-6ee0-4c5b-9b1b-e4325a41e83b.gif">

## React-Beautiful-dnd

### 리액트에서 드래그 앤 드롭을 쉽게하기위해선?

- React로 list를 만들기 위한 아름답고 접근 가능한 드래그 앤 드롭 라이브러리
```jsx
npm i react-beautiful-dnd
npm i --save-dev @types/react-beautiful-dnd
```

- React 18버전에서 에러가 난다면
```jsx
npm i @types/react-beautiful-react-dnd --legacy-peer-deps
```

### DragDropContext

- 기본적으로 드래그 앤 드롭을 가능하게 하고 싶은 앱의 한 부분
- `onDragEnd` 라는 필수 prop을 가진다
  - onDragEnd의 인수에는 많은 요소들을 가지고 있다.
  - result: DropResult (onDragEnd 인수의 type)
  - result.draggableId: 드래그 되었던 Draggable의 id.
  - result.type: 드래그 되었던 Draggable의 type.
  - result.source: Draggable 이 시작된 위치(location).
  - result.destination: Draggable이 끝난 위치(location). 만약에 Draggable이 시작한 위치와 같은 위치로 돌아오면 이 destination값은 null이 될 것이다.

- DragDropContext에는 하위 children이 있어야한다.
- `Droppable` : 우리가 어떤 것을 드롭할 수 있는 영역
    - droppableId라는 필수 prop을 가져 id로 식별
    - Droppable에는 하위 children이 있어야한다.
    - children은 함수여야 한다 : Droppable 안에 컴포넌트를 넣으면 바로 사용할 수 있는 무언갈 얻기 때문이다.
- `Draggable` : 우리가 어떤 것을 드래그할 수 있는 영역
    - droppableId라는 필수 prop을 가져 id로 식별, index라는 필수 prop이 있어 sorting이 필요할때 사용
    - children은 함수여야 한다 : Draggable 안에 컴포넌트를 넣으면 바로 사용할 수 있는 무언갈 얻기 때문이다.
    - < Draggable /> list를 렌더링하는 경우 각 < Draggable />에 key prop을 추가하는 것이 중요하다.
      - key는 list 내에서 고유해야 한다.
      - key에 item의 index가 포함되어서는 안 된다. (map의 index사용 X)
      - 일반적으로 draggableId를 key로 사용하면 간편하다.
      - list에 key가 없으면 React가 경고하지만 `index를 key로 사용하는 경우 경고하지 않는다`.
- `Provided` : Droppable, Draggable에서 주는 첫번째 argument. magic이라고 이름지어 사용하였다.
- Draggable 및 Droppable 컴포넌트 모두 HTMLElement(children)를 제공해야 한다. 이것은 DraggableProvided 및 DroppableProvided 객체의 `innerRef 속성`을 사용하여 수행된다.
- dragHandleProps : 특정 영역을 통해서만 드래그를 가능하도록 하고 싶을 때 사용한다.

```tsx
// DraggableCard.tsx
function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  return (
    <Draggable draggableId={toDoId+ ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}
```

### Board Movement : 할일 이동 로직

- 같은 게시판에서 이동할 때 : destination의 droppableId와 source의 droppableID가 같을 때.
  - 수정이 일어난 게시판만 얕은복사. 이후 복사본을 기존 게시판에 붙여준다.

- 다른 게시판으로 이동할 때 (Ex. Doing에서 Done으로 이동할 때) : 

```tsx
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setTodos((allBoards) => {
        // 게시판 복사본(boardCopy) = ...모든 게시판[선택한 droppableId]
        const boardCopy = [...allBoards[source.droppableId]];
        // 선택된 할일 = 게시판 복사본[선택한 게시판의 index]
        const taskObj = boardCopy[source.index];
        // splice하여 요소를 하나 뺀뒤, destination으로 붙여준다.
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        // return 값은 모든 게시판 복사후, 수정이 일어난 게시판을 다시 붙여줌.
        // 예를 들어 Doing에 변화가 일어났다? [source.droppableId]는 Doing.
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        // 다른 게시판으로 이동해야하니 옮겨갈 게시판의 변수를 하나 설정해준다.
        const destinationBoard = [...allBoards[destination.droppableId]];
        // 마찬가지로 splice로 요소를 하나 뺀뒤, 옮겨갈 게시판에다가 붙여줌. 
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
```

- Droppablestate snapshot
  - `isDraggingOver: boolean` - 현재 선택한 Draggable이 특정 Droppable위에 드래깅 되고 있는지 여부 확인
  - `draggingOverWith: ?DraggableId` - Droppable 위로 드래그하는 Draggable ID
  - `draggingFromThisWith: ?DraggableId` - 현재 Droppable에서 벗어난 드래깅되고 있는 Draggable ID
  - `isUsingPlaceholder: boolean` - placeholder가 사용되고 있는지 여부


### 트러블 슈팅 : 드래그 앤 드롭 시 텍스트가 이상해지거나 간헐적으로 드래그 드롭이 안되는 문제

- 모든 Card 컴포넌트들을 다시 리렌더링, 즉 드래그 하지않는 Card들도 리렌더링 하다보니 간헐적으로 간극이 생겨 버그가 생김
  - 자식 컴포넌트들에 대한 불필요한 리렌더링을 방지해주기 위해 React.memo 사용
  ```tsx
  function MyComponent(props) {
  /* props를 사용하여 렌더링 */
  }
  export default React.memo(MyComponent, areEqual);
  ```