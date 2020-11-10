
import random


def create_test(number, operator):
	#equations = {}
	equations = []
	prev = 0
	i = 1
	while i < 61:
		num = random.randint(0,12)
		if num == prev:
			continue
		direction = random.randint(0,2)
		if direction == 1:
			equations.append([number, operator, num])
		else:
			equations.append([num, operator, number])
		prev = num
		i += 1
	return equations