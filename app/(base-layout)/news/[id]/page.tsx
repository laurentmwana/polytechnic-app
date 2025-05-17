import { News } from '#/model'
import { Heading } from '@/components/shared/heading'
import { fetchJson } from '@/lib/fetch'
import { apiLocalRoute, webRoute } from '@/lib/route'
import { CustomBreadcrumbs } from '@/components/custom-breadcumbs'
import { NewsDetail } from '@/features/news/news-detail'

export default async function NewsShow({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const response = await fetchJson<{ data: News }>(
    apiLocalRoute('news.show', { id })
  )

  const news = response.data

  return (
    <main className="container py-12">
      <Heading title="En savoir plus sur un news" />

      <div className="mb-5">
        <CustomBreadcrumbs
          items={[
            {
              href: webRoute('news.index'),
              label: 'News',
            },
            {
              href: webRoute('news.show', { id }),
              label: `news #${id}`,
              isCurrent: true,
            },
          ]}
        />
      </div>

      <NewsDetail news={news.data} />
    </main>
  )
}
