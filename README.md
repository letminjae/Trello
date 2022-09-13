
# Trello

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
- DragDropContext에는 하위 children이 있어야한다.
- `Droppable` : 우리가 어떤 것을 드롭할 수 있는 영역
    - droppableId라는 필수 prop을 가져 id로 식별
    - Droppable에는 하위 children이 있어야한다.
    - children은 함수여야 한다 : Droppable 안에 컴포넌트를 넣으면 바로 사용할 수 있는 무언갈 얻기 때문이다.
- `Draggable` : 우리가 어떤 것을 드래그할 수 있는 영역
    - droppableId라는 필수 prop을 가져 id로 식별, index라는 필수 prop이 있어 sorting이 필요할때 사용
    - children은 함수여야 한다 : Draggable 안에 컴포넌트를 넣으면 바로 사용할 수 있는 무언갈 얻기 때문이다.
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