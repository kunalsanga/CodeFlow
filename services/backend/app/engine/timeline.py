from typing import Dict, Any, List
from app.engine.models import TimelineFrameModel, SemanticEventModel, SemanticEventType

class TimelineGenerator:
    """
    Independent Timeline Generator processing trace frames into renderer-agnostic playback JSON payloads.
    """
    @staticmethod
    def generate_timeline_payload(
        timeline_frames: List[TimelineFrameModel],
        status: str = "success",
        error_msg: str = None
    ) -> Dict[str, Any]:
        serialized_frames = [frame.to_dict() for frame in timeline_frames]
        final_stdout = timeline_frames[-1].stdout if timeline_frames else ""

        return {
            "status": status,
            "total_steps": len(serialized_frames),
            "trace": serialized_frames,
            "stdout": final_stdout,
            "error": error_msg
        }
