extends Sprite


# Declare member variables here. Examples:
# var a = 2
# var b = "text"

export (int) var minX = 24
export (int) var startX = 600

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass

func _process(delta):
	if self.position.x == minX:
		self.position.x = startX
	self.position.x = self.position.x - 1
