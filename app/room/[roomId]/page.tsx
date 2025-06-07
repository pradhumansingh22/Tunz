"use client";
import MusicRoomDashboard from "@/app/components/roomDashboard";
import { useCurrentSongQueue } from "@/app/lib/store/myStore";
import { closestCorners, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";


export default function Page() {
  const { currentSongQueue, setCurrentSongQueue } = useCurrentSongQueue();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const originalSongPosition = getSongPosition(String(active.id));
    const newSongPosition = getSongPosition(String(over.id));

    const rearrangedQueue = arrayMove(
      currentSongQueue,
      originalSongPosition,
      newSongPosition
    );
    setCurrentSongQueue(rearrangedQueue);
  };

  const getSongPosition = (id: string) =>
    currentSongQueue.findIndex((song) => song.id === id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <main className="h-screen w-screen bg-[#dbe4d0] p-4">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <MusicRoomDashboard />
      </DndContext>
    </main>
  );
}
