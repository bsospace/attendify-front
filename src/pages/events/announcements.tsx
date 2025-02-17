export function Announcement() {
  return (
    <>
    <div className="flex lg:max-w-full items-center">
      <div
        className="flex-none overflow-hidden rounded bg-cover text-center h-40 w-48 lg:rounded-t-none"
        style={{ backgroundImage: `url('https://cdn.dribbble.com/users/2011543/avatars/normal/b7aae1b497eb90457195ecf6d8c4fa7b.jpeg?1676801352')` }}
        title="Woman holding a mug"
      ></div>
      <div className="flex flex-col justify-between border-r border-b border-l border-gray-400 bg-white p-4 leading-normal rounded-r rounded-b-none border-hidden ">
        <div className="mb-8">
          <div className="mb-2 text-xl font-bold text-gray-900 line-clamp-2">
            Can coffee make you a better developer?
          </div>
          <p className="text-base text-gray-700 line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>
      </div>
    </div>
    <hr />
    </>
  );
}
