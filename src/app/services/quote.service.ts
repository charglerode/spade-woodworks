import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  quotes = [
    {
      line: 'Each plank…can have only one ideal use. The woodworker must find this ideal use and create an object of utility to man, and if nature smiles, an object of lasting beauty.',
      attribution: 'George Nakashima',
    },
    {
      line: 'The Expectations of life depend upon diligence; the mechanic that would perfect his work just first sharpen his tools.',
      attribution: 'Confucius',
    },
    {
      line: 'When I’m working on a problem, I never think about beauty. I think only how to solve the problem. But when I have finished, if the solution is not beautiful, I know it is wrong.',
      attribution: 'R. Buckminster Fuller',
    },
    {
      line: 'The pioneers cleared the forests from Jamestown to the Mississippi with fewer tools than are stored in the modern garage.',
      attribution: 'Unknown',
    },
    {
      line: 'One machine can do the work of 50 ordinary men. No machine can do the work of one extraordinary man.',
      attribution: 'Elbert Hubbard',
    },
    {
      line: 'It’s good to have an end to journey toward; but it is the journey that matters, in the end.',
      attribution: 'Ursula K. LeGuin',
    },
    {
      line: 'Only those who have the patience to do simple things perfectly ever acquire the skill to do difficult things easily.',
      attribution: 'Friedrich von Schiller',
    },
    {
      line: 'Any intelligent fool can make things bigger, more complex, and more violent. It takes a touch of genius – and a lot of courage – to move in the opposite direction.',
      attribution: 'E.F. Schumacher',
    },
    {
      line: 'The finest tool ever created is the human hand, but it is weak and it is fallible.',
      attribution: 'Cecil Pierce',
    },
    {
      line: 'Show us a man who never makes a mistake and we will show a man who never makes anything. The capacity for occasional blundering is inseparable from the capacity to bring things to pass.',
      attribution: 'Herman Lincoln Wayland',
    },
    {
      line: '‘Better’ is the enemy of ‘Good.’',
      attribution: 'Michael Dunbar',
    },
    {
      line: 'All things good to know are hard to learn.',
      attribution: 'Greek proverb',
    },
    {
      line: 'He who works with his hands is a laborer. He who works with his hands and his head is a craftsman. He who works with his hands and his head and his heart is an artist.',
      attribution: 'St. Francis of Assissi',
    },
    {
      line: 'Everything should be made as simple as possible, not simpler.',
      attribution: 'Albert Einstein',
    },
    {
      line: 'Give me six hours to chop down a tree and I will spend the first four sharpening the ax.',
      attribution: 'Abraham Lincoln',
    },
    {
      line: 'It is the first of all problems for a man to find out what kind of work he is to do in this universe.',
      attribution: 'Thomas Carlyle',
    },
    {
      line: 'The two most powerful warriors are patience and time.',
      attribution: 'Leo Tolstoy',
    },
    {
      line: 'Hand-craft signifies cunning, or sleight, or Craft of the Hand, which cannot be taught by Words, but is only gained by Practice and Exercise….',
      attribution: 'Joseph Moxon',
    },
    {
      line: 'Ease and speed in doing a thing do not give the work lasting solidity of exactness of beauty.',
      attribution: 'Plutarch',
    },
  ];

  getQuote(): { line: String; attribution: String } {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }
}
